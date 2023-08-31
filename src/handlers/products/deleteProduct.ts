import { APIGatewayEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Product deleted successfully!',
        input: event,
      },
      null,
      2,
    ),
  };
};
