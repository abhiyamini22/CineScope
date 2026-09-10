import { Router } from 'express';

import {
  discoverMoviesHandler,
  getGenresHandler,
  getMovieByIdHandler,
  getPopularMoviesHandler,
  getTrendingMoviesHandler,
  searchMoviesHandler,
} from '../controllers/movieController.js';

const router = Router();

router.get('/popular', getPopularMoviesHandler);
router.get('/trending', getTrendingMoviesHandler);
router.get('/search', searchMoviesHandler);
router.get('/discover', discoverMoviesHandler);
router.get('/genres', getGenresHandler);
router.get('/:id', getMovieByIdHandler);

export default router;
