import { z } from 'zod';

export const wishlistItemSchema = z.object({
  movieId: z.number().int().positive(),
  title: z.string().min(1).max(200),
  posterPath: z.string().optional().nullable(),
  releaseDate: z.string().optional().nullable(),
  rating: z.number().min(0).max(10).optional().nullable(),
});
