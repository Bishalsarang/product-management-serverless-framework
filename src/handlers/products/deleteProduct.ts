import { APIGatewayEvent } from 'aws-lambda';

import dynamoDbDocumentClient from '../../services/dynamoDbDocumentClient';

export const handler = async (event: APIGatewayEvent) => {
  const { id } = event.pathParameters as unknown as { id: '' };

  return await dynamoDbDocumentClient
    .delete({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Key: { id },
    })
    .promise();
};
