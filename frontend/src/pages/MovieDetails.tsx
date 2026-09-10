import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bookmark, Clock3, Globe, Star } from 'lucide-react';

import { useWishlist } from '../context/useWishlist';
import api from '../services/api';
import type { Movie } from '../types/movie';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/movies/${id}`);
        const payload = response.data?.data ?? null;
        setMovie(payload);
      } catch {
        setError('Movie not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };

    void fetchMovie();
  }, [id]);

  if (loading) {
    return <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 text-slate-300">Loading movie details...</div>;
  }

  if (error || !movie) {
    return <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-rose-200">{error ?? 'Movie not found.'}</div>;
  }

  const inWishlist = isInWishlist(movie.id);

  const handleWishlistToggle = async () => {
    if (inWishlist) {
      await removeFromWishlist(movie.id);
      return;
    }

    await addToWishlist({
      movieId: movie.id,
      title: movie.title,
      posterPath: movie.posterUrl,
      releaseDate: movie.releaseDate,
      rating: movie.rating,
    });
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
        <div className="relative h-80 md:h-96">
          <img src={movie.backdropUrl} alt={movie.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="relative -mt-18 px-4 pb-8 pt-0 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            <img src={movie.posterUrl} alt={movie.title} className="h-64 w-44 rounded-2xl border border-white/10 object-cover shadow-2xl" />
            <div className="flex-1 space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white md:text-5xl">{movie.title}</h1>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-300">
                    <span>{movie.releaseDate.slice(0, 4)}</span>
                    <span>•</span>
                    <span>{movie.runtime ? `${movie.runtime} min` : 'Runtime unavailable'}</span>
                    <span>•</span>
                    <span>{movie.originalLanguage.toUpperCase()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${inWishlist ? 'bg-rose-500 text-white' : 'bg-white text-slate-950'}`}
                >
                  <Bookmark size={16} />
                  {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                {movie.genres.length ? movie.genres.map((genre) => (
                  <span key={genre} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">{genre}</span>
                )) : <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">General</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
        <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">Overview</h2>
          <p className="leading-7 text-slate-300">{movie.overview}</p>
        </section>

        <aside className="space-y-4 rounded-3xl border border-white/10 bg-slate-900 p-6">
          <div className="flex items-center gap-3 text-slate-200">
            <Star className="text-amber-400" size={18} />
            <span>{movie.rating.toFixed(1)} / 10</span>
          </div>
          <div className="flex items-center gap-3 text-slate-200">
            <Clock3 className="text-amber-400" size={18} />
            <span>{movie.runtime ? `${movie.runtime} minutes` : 'Runtime unknown'}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-200">
            <Globe className="text-amber-400" size={18} />
            <span>{movie.originalLanguage.toUpperCase()}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-300">
            <p className="text-slate-400">Popularity</p>
            <p className="mt-1 text-2xl font-semibold text-white">{Math.round(movie.popularity)}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
