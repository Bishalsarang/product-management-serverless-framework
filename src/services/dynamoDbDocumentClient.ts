import * as process from 'process';

import * as AWS from 'aws-sdk';

import { config } from 'dotenv';

config();

let dynamoDbDocumentClient: AWS.DynamoDB.DocumentClient;
dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient();

if (process.env.ENVIRONMENT === 'local') {
  dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient({
    endpoint: 'http://localhost:7000',
  });
}

export default dynamoDbDocumentClient;
