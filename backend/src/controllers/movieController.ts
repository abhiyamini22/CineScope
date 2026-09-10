import type { Request, Response, NextFunction } from 'express';

import { movieIdSchema, movieListQuerySchema } from '../validators/movieQuery.js';
import { discoverMovies, getGenres, getMovieById, getPopularMovies, getTrendingMovies, searchMovies } from '../services/tmdbService.js';
import { cacheService } from '../services/cacheService.js';
import { normalizeMovie } from '../utils/normalizeMovie.js';

const buildCacheKey = (prefix: string, params: Record<string, unknown>) => {
  const normalized = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      normalized.append(key, String(value));
    }
  });

  return `${prefix}:${normalized.toString()}`;
};

export const getPopularMoviesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = movieListQuerySchema.parse(req.query);
    const cacheKey = buildCacheKey('popular', { page: query.page, limit: query.limit });
    const cached = cacheService.get(cacheKey);

    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const tmdbResponse = await getPopularMovies(query.page);

    if (!tmdbResponse || !Array.isArray(tmdbResponse.results)) {
      throw Object.assign(new Error('Unexpected TMDB response for popular movies.'), { statusCode: 502 });
    }

    const normalized = {
      page: tmdbResponse.page,
      totalPages: tmdbResponse.total_pages,
      totalResults: tmdbResponse.total_results,
      results: tmdbResponse.results.map(normalizeMovie),
    };

    cacheService.set(cacheKey, normalized, 5 * 60 * 1000);
    return res.json({ success: true, data: normalized });
  } catch (error) {
    next(error);
  }
};

export const getTrendingMoviesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = movieListQuerySchema.parse(req.query);
    const cacheKey = buildCacheKey('trending', { page: query.page, limit: query.limit });
    const cached = cacheService.get(cacheKey);

    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const tmdbResponse = await getTrendingMovies(query.page);

    if (!tmdbResponse || !Array.isArray(tmdbResponse.results)) {
      throw Object.assign(new Error('Unexpected TMDB response for trending movies.'), { statusCode: 502 });
    }

    const normalized = {
      page: tmdbResponse.page,
      totalPages: tmdbResponse.total_pages,
      totalResults: tmdbResponse.total_results,
      results: tmdbResponse.results.map(normalizeMovie),
    };

    cacheService.set(cacheKey, normalized, 5 * 60 * 1000);
    return res.json({ success: true, data: normalized });
  } catch (error) {
    next(error);
  }
};

export const searchMoviesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = movieListQuerySchema.parse(req.query);

    if (!query.query || query.query.trim().length < 2) {
      return res.json({
        success: true,
        data: {
          page: 1,
          totalPages: 0,
          totalResults: 0,
          results: [],
        },
      });
    }

    const cacheKey = buildCacheKey('search', { query: query.query, page: query.page, genre: query.genre });
    const cached = cacheService.get(cacheKey);

    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const tmdbResponse = await searchMovies(query.query.trim(), query.page);

    if (!tmdbResponse || !Array.isArray(tmdbResponse.results)) {
      throw Object.assign(new Error('Unexpected TMDB response for search results.'), { statusCode: 502 });
    }

    const normalized = {
      page: tmdbResponse.page,
      totalPages: tmdbResponse.total_pages,
      totalResults: tmdbResponse.total_results,
      results: tmdbResponse.results.map(normalizeMovie),
    };

    cacheService.set(cacheKey, normalized, 2 * 60 * 1000);
    return res.json({ success: true, data: normalized });
  } catch (error) {
    next(error);
  }
};

export const discoverMoviesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = movieListQuerySchema.parse(req.query);

    const params: Record<string, unknown> = {
      page: query.page,
      sort_by: query.sortBy || 'popularity.desc',
      with_genres: query.genre,
      primary_release_year: query.year,
      'vote_average.gte': query.rating,
    };

    const cacheKey = buildCacheKey('discover', params);
    const cached = cacheService.get(cacheKey);

    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const tmdbResponse = await discoverMovies(params);

    if (!tmdbResponse || !Array.isArray(tmdbResponse.results)) {
      throw Object.assign(new Error('Unexpected TMDB response for discover results.'), { statusCode: 502 });
    }

    const normalized = {
      page: tmdbResponse.page,
      totalPages: tmdbResponse.total_pages,
      totalResults: tmdbResponse.total_results,
      results: tmdbResponse.results.map(normalizeMovie),
    };

    cacheService.set(cacheKey, normalized, 4 * 60 * 1000);
    return res.json({ success: true, data: normalized });
  } catch (error) {
    next(error);
  }
};

export const getMovieByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = movieIdSchema.parse(req.params);
    const cacheKey = `movie:${parsed.id}`;
    const cached = cacheService.get(cacheKey);

    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const movie = await getMovieById(parsed.id);

    if (!movie || !movie.id) {
      throw Object.assign(new Error('Movie not found.'), { statusCode: 404 });
    }

    const normalized = normalizeMovie(movie);

    cacheService.set(cacheKey, normalized, 10 * 60 * 1000);
    return res.json({ success: true, data: normalized });
  } catch (error) {
    next(error);
  }
};

export const getGenresHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = 'genres';
    const cached = cacheService.get(cacheKey);

    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const genresResponse = await getGenres();
    const normalized = (genresResponse.genres || []).map((genre: any) => ({
      id: genre.id,
      name: genre.name,
    }));

    cacheService.set(cacheKey, normalized, 30 * 60 * 1000);
    return res.json({ success: true, data: normalized });
  } catch (error) {
    next(error);
  }
};
