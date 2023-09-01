import { z } from 'zod';

export const createProductRequestSchema = z.object({
  name: z.string().min(3).max(255),
  price: z.number().positive(),
  description: z.string().optional(),
  imageURL: z.string().url().optional(),
});

export const productSchema = createProductRequestSchema.extend({
  id: z.string().uuid(),
});
