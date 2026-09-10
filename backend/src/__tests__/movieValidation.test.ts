import { describe, expect, it } from 'vitest';

import { movieIdSchema, movieListQuerySchema } from '../validators/movieQuery.js';
import { wishlistItemSchema } from '../validators/wishlist.js';
import { normalizeMovie } from '../utils/normalizeMovie.js';

describe('movie validation', () => {
  it('accepts valid movie list query values', () => {
    const parsed = movieListQuerySchema.parse({
      page: '2',
      limit: '10',
      query: 'Inception',
      year: '2024',
      rating: '7.5',
    });

    expect(parsed.page).toBe(2);
    expect(parsed.limit).toBe(10);
    expect(parsed.query).toBe('Inception');
  });

  it('rejects invalid movie ids', () => {
    expect(() => movieIdSchema.parse({ id: '0' })).toThrow();
  });

  it('validates wishlist payload correctly', () => {
    const item = wishlistItemSchema.parse({
      movieId: 123,
      title: 'The Matrix',
      posterPath: '/poster.jpg',
      releaseDate: '1999-03-31',
      rating: 8.7,
    });

    expect(item.title).toBe('The Matrix');
    expect(item.movieId).toBe(123);
  });
});

describe('movie normalization', () => {
  it('falls back gracefully when TMDB payload fields are missing', () => {
    const normalized = normalizeMovie({ id: 42 });

    expect(normalized.id).toBe(42);
    expect(normalized.title).toBe('Untitled Movie');
    expect(normalized.overview).toBe('No overview available.');
    expect(normalized.genres).toEqual([]);
    expect(normalized.runtime).toBeNull();
  });
});
