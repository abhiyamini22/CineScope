export type Movie = {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  rating: number;
  popularity: number;
  genres: string[];
  runtime: number | null;
  originalLanguage: string;
  voteCount: number;
};

export type MovieListResponse = {
  page: number;
  totalPages: number;
  totalResults: number;
  results: Movie[];
};

export type Genre = {
  id: number;
  name: string;
};

export type WishlistItem = {
  _id?: string;
  userId: string;
  movieId: number;
  title: string;
  posterPath?: string | null;
  releaseDate?: string | null;
  rating?: number | null;
  createdAt?: string;
};
