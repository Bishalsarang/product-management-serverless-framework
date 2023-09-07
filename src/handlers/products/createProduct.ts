import * as process from 'process';

import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import { v4 as uuidv4 } from 'uuid';
import * as createError from 'http-errors';

import handlerWithMiddleware from '../../middlewares/handlerWithMiddleware';
import dynamoDbDocumentClient from '../../services/dynamoDbDocumentClient';

import { Product, CreateProductRequestDTO } from '../../types';
import { createProductRequestSchema } from '../../schema/productSchema';

import { addToAuditLog } from '../../utils/auditLogs.utils';

import { uploadToS3 } from '../../utils/s3.util';

async function createProduct(
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> {
  const createProductRequest = event.body as unknown as CreateProductRequestDTO;
  try {
    createProductRequestSchema.parse(createProductRequest.product);
  } catch (error) {
    throw new createError.BadRequest(error);
  }

  const imageURL = await uploadToS3(
    createProductRequest.filename,
    createProductRequest.base64ImageString,
  );

  const item: Product = {
    ...createProductRequest.product,
    id: uuidv4(),
    imageURL,
  };

  try {
    await dynamoDbDocumentClient
      .put({
        Item: item,
        TableName: process.env.PRODUCTS_TABLE_NAME,
      })
      .promise();
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  await addToAuditLog({
    entityName: 'products',
    action: 'created',
    newValue: item,
  });

  return {
    statusCode: 201,
    body: JSON.stringify(item),
  };
}

export const handler = handlerWithMiddleware(createProduct);
