export type NormalizedMovie = {
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

const placeholderPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
const placeholderBackdrop = 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80';

export const normalizeMovie = (movie: any): NormalizedMovie => {
  const title = movie?.title || movie?.name || 'Untitled Movie';
  const overview = movie?.overview || 'No overview available.';
  const posterUrl = movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : placeholderPoster;
  const backdropUrl = movie?.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : placeholderBackdrop;
  const releaseDate = movie?.release_date || movie?.first_air_date || 'N/A';
  const rating = Number(movie?.vote_average ?? 0);
  const popularity = Number(movie?.popularity ?? 0);
  const genres = Array.isArray(movie?.genres)
    ? movie.genres.map((genre: any) => genre?.name || 'Unknown').filter(Boolean)
    : Array.isArray(movie?.genre_ids)
      ? movie.genre_ids.map((id: number) => `Genre ${id}`)
      : [];
  const runtime = typeof movie?.runtime === 'number' ? movie.runtime : null;
  const originalLanguage = movie?.original_language || 'Unknown';
  const voteCount = Number(movie?.vote_count ?? 0);

  return {
    id: Number(movie?.id ?? 0),
    title,
    overview,
    posterUrl,
    backdropUrl,
    releaseDate,
    rating,
    popularity,
    genres,
    runtime,
    originalLanguage,
    voteCount,
  };
};
