import * as process from 'process';

import * as AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import handlerWithMiddleware from '../../middlewares/handlerWithMiddleware';

import { UploadImageRequest } from '../../types';

const s3 = new AWS.S3();

async function uploadImage(
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> {
  const { base64, filename } = event.body as unknown as UploadImageRequest;

  const data: PutObjectRequest = {
    Bucket: process.env.PRODUCTS_BUCKET_NAME,
    Key: `${filename} + ${new Date().getTime()}`,
    Body: Buffer.from(base64, 'base64'),
    ContentEncoding: 'base64',
    ACL: 'public-read',
  };

  try {
    await s3.putObject(data).promise();
  } catch (err) {
    if (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Failed to upload image' + err + JSON.stringify(err),
        }),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ error: 'Image uploaded successfully' }),
  };
}

export const handler = handlerWithMiddleware(uploadImage);
