import * as process from 'process';

import * as AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import handlerWithMiddleware from '../../middlewares/handlerWithMiddleware';

import { Product, UploadImageRequest } from '../../types';
import dynamoDbDocumentClient from '../../services/dynamoDbDocumentClient';
import * as createError from 'http-errors';
import { addToAuditLog } from '../../utils/auditLogs.utils';

const s3 = new AWS.S3();

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

  const data: PutObjectRequest = {
    Bucket: process.env.PRODUCTS_BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(base64, 'base64'),
    ContentEncoding: 'base64',
    ACL: 'public-read',
  };

  try {
    await s3.putObject(data).promise();
  } catch (err) {
    throw new createError.InternalServerError(err);
  }
  const updatedProductItem: Product = {
    ...item,
    imageURL: `https://${process.env.PRODUCTS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
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
