import { z } from 'zod';

export const createProductRequestSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(255, 'Name cannot exceed 255 characters'),
  price: z.number().positive('Price must be a positive number'),
  description: z.string().optional(),
  imageURL: z
    .string()
    .url('Image URL must be a valid URL')
    .optional()
    .or(z.literal('')),
});

export const productSchema = createProductRequestSchema.extend({
  id: z.string().uuid(),
});
