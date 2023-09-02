import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';

import { ApiGatewayLambdaHandler } from '../types';

export default (handler: ApiGatewayLambdaHandler) =>
  middy(handler).use([httpEventNormalizer(), httpJsonBodyParser()]);
