import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';

import { ApiGatewayLambdaHandler } from '../types';

export default (handler: ApiGatewayLambdaHandler) =>
  middy(handler).use([
    httpErrorHandler(),
    httpEventNormalizer(),
    httpJsonBodyParser(),
  ]);
