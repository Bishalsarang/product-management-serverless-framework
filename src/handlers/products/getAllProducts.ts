import { APIGatewayEvent } from 'aws-lambda';
import { AttributeMap, DocumentClient } from 'aws-sdk/clients/dynamodb';

import * as createError from 'http-errors';

import handlerWithMiddleware from '../../middlewares/handlerWithMiddleware';
import dynamoDbDocumentClient from '../../services/dynamoDbDocumentClient';

async function getAllProducts(event: APIGatewayEvent) {
  let items: AttributeMap[] = [];
  let lastEvaluatedKey: DocumentClient.Key | undefined;

  try {
    do {
      const data = await dynamoDbDocumentClient
        .scan({
          TableName: process.env.PRODUCTS_TABLE_NAME,
          ExclusiveStartKey: lastEvaluatedKey,
        })
        .promise();

      if (data.Items && data.Items.length > 0) {
        items = [...items, ...data.Items];
      }

      lastEvaluatedKey = data.LastEvaluatedKey;
    } while (lastEvaluatedKey != null);
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
}

export const handler = handlerWithMiddleware(getAllProducts);
