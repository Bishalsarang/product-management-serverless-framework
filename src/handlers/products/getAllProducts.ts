import { AttributeMap, DocumentClient } from 'aws-sdk/clients/dynamodb';

import dynamoDbDocumentClient from '../../services/dynamoDbDocumentClient';
import handlerWithMiddleware from '../../middlewares/handlerWithMiddleware';

async function getAllProducts() {
  let items: AttributeMap[] = [];
  let lastEvaluatedKey: DocumentClient.Key | undefined;

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

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
}

export const handler = handlerWithMiddleware(getAllProducts);
