import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridgeEVent } from '../types';

async function logAudit(
  event: EventBridgeEVent,
): Promise<APIGatewayProxyResult> {
  console.log(JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify('Hello World from logAudit!' + JSON.stringify(event)),
  };
}

export const handler = logAudit;
