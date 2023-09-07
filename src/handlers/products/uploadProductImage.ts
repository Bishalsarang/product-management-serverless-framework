import * as process from 'process';

import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import * as createError from 'http-errors';

import handlerWithMiddleware from '../../middlewares/handlerWithMiddleware';

import { Product, UploadImageRequest } from '../../types';
import dynamoDbDocumentClient from '../../services/dynamoDbDocumentClient';

import { uploadToS3 } from '../../utils/s3.util';
import { addToAuditLog } from '../../utils/auditLogs.utils';

async function uploadImage(
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters as unknown as { id: '' };
  const { base64, filename } = event.body as unknown as UploadImageRequest;

  const itemPromise = await dynamoDbDocumentClient
    .get({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Key: { id },
    })
    .promise();

  const item = itemPromise.Item as Product;
  const fileName = `${filename}_${new Date().getTime()}`;
  const imageURL = await uploadToS3(fileName, base64);

  const updatedProductItem: Product = {
    ...item,
    imageURL,
  };

  try {
    await dynamoDbDocumentClient
      .put({
        Item: updatedProductItem,
        TableName: process.env.PRODUCTS_TABLE_NAME,
      })
      .promise();
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  await addToAuditLog({
    oldValue: item,
    newValue: updatedProductItem,
    entityName: 'products',
    action: 'updated',
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Image uploaded successfully for product with id: ' + id,
    }),
  };
}

export const handler = handlerWithMiddleware(uploadImage);
