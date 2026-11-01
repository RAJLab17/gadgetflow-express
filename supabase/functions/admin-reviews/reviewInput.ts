import { z } from 'npm:zod@3.25.76';

export const reviewSettingsSchema = z.object({
  id: z.string().uuid(), source: z.enum(['raj', 'google']), featured_home: z.boolean(),
});
export const manualReviewSchema = z.object({
  customer_name: z.string().trim().min(1).max(100),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(1).max(200),
  comment: z.string().trim().min(1).max(5000),
  created_at: z.string().datetime(),
  product_id: z.enum(['nexus', 'matrix', 'airpods-case']),
  source: z.enum(['raj', 'google']),
});