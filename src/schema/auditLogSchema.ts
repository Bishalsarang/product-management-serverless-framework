import { z } from 'zod';

import { productSchema } from './productSchema';

export const createAuditLogRequestSchema = z.object({
  entityId: z.string().uuid().optional(),
  entityName: z.enum(['products']),
  changeType: z.enum(['created', 'deleted', 'updated']),
  modifiedAt: z.string().datetime(),
  oldValue: z.string().optional(),
  newValue: z.string().optional(),
});

export const auditLogSchema = createAuditLogRequestSchema.extend({
  id: z.string().uuid(),
});
