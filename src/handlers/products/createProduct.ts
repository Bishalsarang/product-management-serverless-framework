import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import * as createError from 'http-errors';

import * as process from 'process';

import dynamoDbDocumentClient from '../../services/dynamoDbDocumentClient';

import { Product, CreateProductRequest } from '../../types';

import handlerWithMiddleware from '../../middlewares/handlerWithMiddleware';
import { createProductRequestSchema } from '../../schema/productSchema';

async function createProduct(
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> {
  const createProductRequest = event.body as unknown as CreateProductRequest;
  try {
    createProductRequestSchema.parse(createProductRequest);
  } catch (error) {
    throw new createError.BadRequest(error);
  }

  const item: Product = {
    ...createProductRequest,
    id: uuidv4(),
  };

  try {
    await dynamoDbDocumentClient
      .put({
        Item: item,
        TableName: process.env.PRODUCTS_TABLE_NAME,
      })
      .promise();
  } catch (e) {
    throw new createError.InternalServerError(e);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(item),
  };
}

export const handler = handlerWithMiddleware(createProduct);
