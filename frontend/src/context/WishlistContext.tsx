import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import api from '../services/api';
import type { WishlistItem } from '../types/movie';

type WishlistContextShape = {
  wishlist: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (movie: { movieId: number; title: string; posterPath?: string | null; releaseDate?: string | null; rating?: number | null }) => Promise<void>;
  removeFromWishlist: (movieId: number) => Promise<void>;
  isInWishlist: (movieId: number) => boolean;
  refreshWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextShape | undefined>(undefined);

const getUserId = () => {
  let userId = localStorage.getItem('cinescope-user-id');

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('cinescope-user-id', userId);
  }

  return userId;
};

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await api.get('/wishlist');
      setWishlist(response.data?.data ?? []);
    } catch {
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserId();
    void refreshWishlist();
  }, [refreshWishlist]);

  const addToWishlist = useCallback(async (movie: { movieId: number; title: string; posterPath?: string | null; releaseDate?: string | null; rating?: number | null }) => {
    try {
      await api.post('/wishlist', movie);
      await refreshWishlist();
    } catch (error) {
      console.error('Failed to add wishlist item', error);
    }
  }, [refreshWishlist]);

  const removeFromWishlist = useCallback(async (movieId: number) => {
    try {
      await api.delete(`/wishlist/${movieId}`);
      await refreshWishlist();
    } catch (error) {
      console.error('Failed to remove wishlist item', error);
    }
  }, [refreshWishlist]);

  const isInWishlist = useCallback((movieId: number) => {
    return wishlist.some((item) => Number(item.movieId) === Number(movieId));
  }, [wishlist]);

  const value = useMemo<WishlistContextShape>(() => ({
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist,
  }), [wishlist, isLoading, addToWishlist, removeFromWishlist, isInWishlist, refreshWishlist]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }

  return context;
};
