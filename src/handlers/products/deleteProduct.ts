import { APIGatewayEvent } from 'aws-lambda';

import * as createError from 'http-errors';

import handlerWithMiddleware from '../../middlewares/handlerWithMiddleware';
import dynamoDbDocumentClient from '../../services/dynamoDbDocumentClient';
import { addToAuditLog } from '../../utils/auditLogs.utils';
import { Product } from '../../types';

async function deleteProduct(event: APIGatewayEvent) {
  const { id } = event.pathParameters as unknown as { id: '' };

  const itemPromise = await dynamoDbDocumentClient
    .get({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Key: { id },
    })
    .promise();
  const item = itemPromise.Item as Product;

  try {
    await dynamoDbDocumentClient
      .delete({
        TableName: process.env.PRODUCTS_TABLE_NAME,
        Key: { id },
      })
      .promise();
  } catch (error) {
    throw new createError.InternalServerError(error.message);
  }

  await addToAuditLog({
    entityName: 'products',
    oldValue: item,
    action: 'deleted',
  });

  return {
    statusCode: 204,
    body: JSON.stringify({
      message: `Product with id: ${id} deleted successfully.`,
    }),
  };
}

export const handler = handlerWithMiddleware(deleteProduct);
