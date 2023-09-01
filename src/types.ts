import { z } from 'zod';

import { envSchema } from './schema/envSchema';
import {
  createProductRequestSchema,
  productSchema,
} from './schema/productSchema';

type Env = z.infer<typeof envSchema>;
type Product = z.infer<typeof productSchema>;
type CreateProductRequest = z.infer<typeof createProductRequestSchema>;

export { Env, Product, CreateProductRequest };
