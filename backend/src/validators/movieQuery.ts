import { z } from 'zod';

export const movieListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(20),
  query: z.string().trim().optional(),
  genre: z.string().trim().optional(),
  sortBy: z.string().trim().optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  rating: z.coerce.number().min(0).max(10).optional(),
});

export const movieIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});
