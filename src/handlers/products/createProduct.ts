import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import * as process from 'process';

import dynamoDbDocumentClient from '../../services/dynamoDbDocumentClient';

import { Product, CreateProductRequest } from '../../types';

export const handler = async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  const createProductRequest = event.body as unknown as CreateProductRequest;

  const item: Product = {
    ...createProductRequest,
    id: 'uuid',
  };

  await dynamoDbDocumentClient
    .put({
      Item: item,
      TableName: process.env.PRODUCTS_TABLE_NAME,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(item),
  };
};
