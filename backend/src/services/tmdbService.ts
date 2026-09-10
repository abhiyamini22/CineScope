import axios, { AxiosError } from 'axios';

import { env } from '../config/env.js';

const tmdb = axios.create({
  baseURL: env.tmdbBaseUrl,
  timeout: 10000,
  params: {
    api_key: env.tmdbApiKey,
  },
});

const toTmdbError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<{ status_message?: string }>;
    const message = axiosError.response?.data?.status_message || 'TMDB request failed';
    const wrapped = new Error(message) as Error & { statusCode: number };
    wrapped.statusCode = axiosError.response?.status || 502;
    return wrapped;
  }

  const wrapped = new Error('Unexpected TMDB response') as Error & { statusCode: number };
  wrapped.statusCode = 502;
  return wrapped;
};

export type TmdbMovieItem = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  popularity?: number;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  runtime?: number | null;
  original_language?: string;
  vote_count?: number;
};

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdb.get('/movie/popular', { params: { page } });
    return response.data;
  } catch (error) {
    throw toTmdbError(error);
  }
};

export const getTrendingMovies = async (page = 1) => {
  try {
    const response = await tmdb.get('/trending/movie/week', { params: { page } });
    return response.data;
  } catch (error) {
    throw toTmdbError(error);
  }
};

export const searchMovies = async (query: string, page = 1) => {
  try {
    const response = await tmdb.get('/search/movie', { params: { query, page } });
    return response.data;
  } catch (error) {
    throw toTmdbError(error);
  }
};

export const discoverMovies = async (params: Record<string, unknown>) => {
  try {
    const response = await tmdb.get('/discover/movie', { params });
    return response.data;
  } catch (error) {
    throw toTmdbError(error);
  }
};

export const getMovieById = async (id: number) => {
  try {
    const response = await tmdb.get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    throw toTmdbError(error);
  }
};

export const getGenres = async () => {
  try {
    const response = await tmdb.get('/genre/movie/list');
    return response.data;
  } catch (error) {
    throw toTmdbError(error);
  }
};
