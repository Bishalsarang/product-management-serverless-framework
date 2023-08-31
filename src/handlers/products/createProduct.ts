import { APIGatewayEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent) => {
  return {
    statusCode: 201,
    body: JSON.stringify(
      {
        message: 'Created a product successfully!',
        input: event,
      },
      null,
      2,
    ),
  };
};
