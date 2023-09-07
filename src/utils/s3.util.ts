import { PutObjectRequest } from 'aws-sdk/clients/s3';
import * as process from 'process';
import * as AWS from 'aws-sdk';

import * as createError from 'http-errors';

const s3 = new AWS.S3();

export async function uploadToS3(filename: string, base64ImageString: string) {
  const fileName = `${filename}_${new Date().getTime()}`;
  const data: PutObjectRequest = {
    Bucket: process.env.PRODUCTS_BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(base64ImageString, 'base64'),
    ContentEncoding: 'base64',
    ACL: 'public-read',
  };

  try {
    await s3.putObject(data).promise();
  } catch (err) {
    throw new createError.InternalServerError(err);
  }

  return `https://${process.env.PRODUCTS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
}
