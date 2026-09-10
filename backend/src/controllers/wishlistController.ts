import type { Request, Response, NextFunction } from 'express';

import Wishlist from '../models/Wishlist.js';
import { wishlistItemSchema } from '../validators/wishlist.js';

const getUserId = (req: Request) => {
  const userId = req.headers['x-user-id'];
  if (typeof userId !== 'string' || userId.trim().length === 0) {
    throw Object.assign(new Error('User ID is required.'), { statusCode: 400 });
  }
  return userId;
};

export const getWishlistHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const items = await Wishlist.find({ userId }).sort({ createdAt: -1 });
    return res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const addWishlistItemHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const payload = wishlistItemSchema.parse(req.body);

    const existing = await Wishlist.findOne({ userId, movieId: payload.movieId });
    if (existing) {
      return res.status(200).json({ success: true, data: existing, message: 'Movie already in wishlist' });
    }

    const item = await Wishlist.create({
      userId,
      movieId: payload.movieId,
      title: payload.title,
      posterPath: payload.posterPath ?? null,
      releaseDate: payload.releaseDate ?? null,
      rating: payload.rating ?? null,
      createdAt: new Date(),
    });

    return res.status(201).json({ success: true, data: item, message: 'Movie added to wishlist' });
  } catch (error) {
    next(error);
  }
};

export const removeWishlistItemHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const movieId = Number(req.params.movieId);

    if (!Number.isInteger(movieId) || movieId <= 0) {
      throw Object.assign(new Error('Invalid movie ID.'), { statusCode: 400 });
    }

    const result = await Wishlist.findOneAndDelete({ userId, movieId });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Movie not found in wishlist.' });
    }

    return res.json({ success: true, message: 'Movie removed from wishlist.' });
  } catch (error) {
    next(error);
  }
};

export const checkWishlistItemHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const movieId = Number(req.params.movieId);

    if (!Number.isInteger(movieId) || movieId <= 0) {
      throw Object.assign(new Error('Invalid movie ID.'), { statusCode: 400 });
    }

    const item = await Wishlist.findOne({ userId, movieId });
    return res.json({ success: true, data: !!item });
  } catch (error) {
    next(error);
  }
};
