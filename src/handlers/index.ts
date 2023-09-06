import { APIGatewayProxyResult } from 'aws-lambda';

import { handler as createProduct } from './products/createProduct';
import { handler as deleteProduct } from './products/deleteProduct';
import { handler as getAllProducts } from './products/getAllProducts';
import { handler as uploadProductImage } from './products/uploadProductImage';

async function hello(): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: JSON.stringify('Hello World!'),
  };
}

export {
  hello,
  createProduct,
  deleteProduct,
  getAllProducts,
  uploadProductImage,
};
