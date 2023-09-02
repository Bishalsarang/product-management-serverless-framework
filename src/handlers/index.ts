import { handler as createProduct } from './products/createProduct';
import { handler as deleteProduct } from './products/deleteProduct';
import { handler as getAllProducts } from './products/getAllProducts';
import { APIGatewayProxyResult } from 'aws-lambda';

async function hello(): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: JSON.stringify('Hello World!'),
  };
}

export { createProduct, deleteProduct, getAllProducts, hello };
