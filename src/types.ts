import { z } from 'zod';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { envSchema } from './schema/envSchema';
import {
  productSchema,
  createProductRequestSchema,
} from './schema/productSchema';
import {
  auditLogSchema,
  createAuditLogRequestSchema,
} from './schema/auditLogSchema';

type Env = z.infer<typeof envSchema>;
type Product = z.infer<typeof productSchema>;
type AuditLog = z.infer<typeof auditLogSchema>;

type CreateProductRequest = z.infer<typeof createProductRequestSchema>;
type CreateAuditLogRequest = z.infer<typeof createAuditLogRequestSchema>;
type ApiGatewayLambdaHandler = (
  event: APIGatewayProxyEvent,
) => Promise<APIGatewayProxyResult>;

interface UploadImageRequest {
  filename: 'string';
  base64: 'string';
}

interface AuditLogOldNewValue {
  // JSON string
  oldValue?: string;
  newValue?: string;
}

type AuditLogChangeType = AuditLog['changeType'];
type AuditLogEntity = AuditLog['entityName'];

interface EventBridgeEVent {
  source: AuditLogEntity;
  detail: AuditLogOldNewValue;
  'detail-type': AuditLogChangeType;
}

interface AuditLogActionCreateRequest {
  newValue?: Product;
  oldValue?: Product;
  entityName: string;
  action: AuditLogChangeType;
}

interface CreateProductRequestDTO {
  product: CreateProductRequest;
  base64ImageString: string;
  filename: string;
}

export {
  Env,
  Product,
  AuditLog,
  AuditLogChangeType,
  CreateProductRequestDTO,
  EventBridgeEVent,
  UploadImageRequest,
  CreateProductRequest,
  CreateAuditLogRequest,
  ApiGatewayLambdaHandler,
  AuditLogActionCreateRequest,
};
