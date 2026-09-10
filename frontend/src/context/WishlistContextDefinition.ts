import { createContext } from 'react';

import type { WishlistItem } from '../types/movie';

export type WishlistContextShape = {
  wishlist: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (movie: { movieId: number; title: string; posterPath?: string | null; releaseDate?: string | null; rating?: number | null }) => Promise<void>;
  removeFromWishlist: (movieId: number) => Promise<void>;
  isInWishlist: (movieId: number) => boolean;
  refreshWishlist: () => Promise<void>;
};

export const WishlistContext = createContext<WishlistContextShape | undefined>(undefined);