import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';

import { ApiGatewayLambdaHandler } from '../types';

export default (handler: ApiGatewayLambdaHandler) =>
  middy(handler).use([httpJsonBodyParser()]);
