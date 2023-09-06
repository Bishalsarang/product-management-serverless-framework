import { z } from 'zod';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { envSchema } from './schema/envSchema';
import {
  productSchema,
  createProductRequestSchema,
} from './schema/productSchema';

type Env = z.infer<typeof envSchema>;
type Product = z.infer<typeof productSchema>;
type CreateProductRequest = z.infer<typeof createProductRequestSchema>;
type ApiGatewayLambdaHandler = (
  event: APIGatewayProxyEvent,
) => Promise<APIGatewayProxyResult>;

interface uploadImageRequest {
  filename: 'string';
  base64: 'string';
}

export {
  Env,
  Product,
  uploadImageRequest,
  CreateProductRequest,
  ApiGatewayLambdaHandler,
};
