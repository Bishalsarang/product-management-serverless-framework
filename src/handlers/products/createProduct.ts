import { APIGatewayProxyResult } from 'aws-lambda';

import * as process from 'process';

import dynamoDbDocumentClient from '../../services/dynamoDbDocumentClient';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const item = {
    id: '1',
    name: 'Asus Zephyrus',
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
