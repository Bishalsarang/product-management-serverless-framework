import { z } from 'zod';

export const envSchema = z.object({
  ENVIRONMENT: z.enum(['local', 'production']).default('local'),
  DYNAMODB_PORT: z.number().default(8000),
  PRODUCTS_TABLE_NAME: z.string(),
});

export const ENV = envSchema.parse(process.env);
