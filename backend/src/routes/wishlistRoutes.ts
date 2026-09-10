import { Router } from 'express';

import {
  addWishlistItemHandler,
  checkWishlistItemHandler,
  getWishlistHandler,
  removeWishlistItemHandler,
} from '../controllers/wishlistController.js';

const router = Router();

router.get('/', getWishlistHandler);
router.post('/', addWishlistItemHandler);
router.delete('/:movieId', removeWishlistItemHandler);
router.get('/:movieId', checkWishlistItemHandler);

export default router;
