import { APIGatewayEvent } from 'aws-lambda';

import dynamoDbDocumentClient from '../../services/dynamoDbDocumentClient';

import handlerWithMiddleware from '../../middlewares/handlerWithMiddleware';
import * as createError from 'http-errors';

async function deleteProduct(event: APIGatewayEvent) {
  const { id } = event.pathParameters as unknown as { id: '' };

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

  return {
    statusCode: 204,
    body: JSON.stringify({
      message: `Product with id: ${id} deleted successfully.`,
    }),
  };
}

export const handler = handlerWithMiddleware(deleteProduct);
