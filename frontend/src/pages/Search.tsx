import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';
import type { Movie, MovieListResponse } from '../types/movie';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const trimmed = debouncedQuery.trim();

      if (!trimmed || trimmed.length < 2) {
        setMovies([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get('/movies/search', { params: { query: trimmed, page: 1 } });
        const payload: MovieListResponse = response.data?.data ?? { page: 1, totalPages: 1, totalResults: 0, results: [] };
        setMovies(payload.results);
      } catch {
        setError('Search is temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };

    void fetchSearchResults();
  }, [debouncedQuery]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-5">
        <label className="block text-sm font-medium text-slate-300">Search movies</label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-white/10 bg-slate-800/70 p-3">
              <div className="h-72 rounded-xl bg-slate-700" />
              <div className="mt-4 h-4 w-3/4 rounded bg-slate-700" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-200">{error}</div>
      ) : !query.trim() ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 text-center text-slate-300">Start typing to discover movies.</div>
      ) : movies.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 text-center text-slate-300">No movies matched your search.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {movies.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-lg transition hover:-translate-y-1 hover:border-amber-400/40">
              <img src={movie.posterUrl} alt={movie.title} className="h-80 w-full object-cover" loading="lazy" />
              <div className="space-y-2 p-4">
                <h3 className="line-clamp-2 text-lg font-semibold text-white">{movie.title}</h3>
                <p className="text-sm text-slate-400">{movie.releaseDate.slice(0, 4)} • ⭐ {movie.rating.toFixed(1)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
