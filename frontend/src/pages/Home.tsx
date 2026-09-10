import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../services/api';
import type { Genre, Movie, MovieListResponse } from '../types/movie';

const sortOptions = [
  { label: 'Popularity', value: 'popularity.desc' },
  { label: 'Rating', value: 'vote_average.desc' },
  { label: 'Release date', value: 'primary_release_date.desc' },
  { label: 'Title', value: 'original_title.asc' },
];

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedSort, setSelectedSort] = useState('popularity.desc');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/movies/genres');
        const payload = Array.isArray(response.data?.data) ? response.data.data : [];
        setGenres(payload);
      } catch {
        setGenres([]);
      }
    };

    void fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get('/movies/discover', {
          params: {
            page,
            sortBy: selectedSort,
            genre: selectedGenre,
            year: selectedYear || undefined,
            rating: selectedRating || undefined,
          },
        });

        const payload: MovieListResponse = response.data?.data ?? {
          page: 1,
          totalPages: 1,
          totalResults: 0,
          results: [],
        };

        setMovies(payload.results);
        setTotalPages(payload.totalPages || 1);
      } catch {
        setError('Unable to load movies right now.');
      } finally {
        setLoading(false);
      }
    };

    void fetchMovies();
  }, [page, selectedGenre, selectedSort, selectedYear, selectedRating]);

  const resetFilters = () => {
    setSelectedGenre('');
    setSelectedSort('popularity.desc');
    setSelectedYear('');
    setSelectedRating('');
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.22),_transparent_35%)]" />
        <div className="relative max-w-2xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">Discover</p>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Find your next obsession.</h1>
          <p className="text-lg text-slate-300">Browse trending titles, explore new favorites, and build a deck of movies you want to watch next.</p>
        </div>
      </section>

      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm text-slate-300">Genre</label>
            <select
              value={selectedGenre}
              onChange={(event) => {
                setSelectedGenre(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-400"
            >
              <option value="">All genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-sm text-slate-300">Sort</label>
            <select
              value={selectedSort}
              onChange={(event) => {
                setSelectedSort(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-400"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="w-32">
            <label className="mb-2 block text-sm text-slate-300">Year</label>
            <input
              type="number"
              value={selectedYear}
              onChange={(event) => {
                setSelectedYear(event.target.value);
                setPage(1);
              }}
              placeholder="2024"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-400"
            />
          </div>

          <div className="w-32">
            <label className="mb-2 block text-sm text-slate-300">Rating</label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={selectedRating}
              onChange={(event) => {
                setSelectedRating(event.target.value);
                setPage(1);
              }}
              placeholder="7.5"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-slate-200"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Curated picks</h2>
        <p className="text-sm text-slate-400">Page {page} of {totalPages}</p>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-white/10 bg-slate-800/70 p-3">
              <div className="h-72 rounded-xl bg-slate-700" />
              <div className="mt-4 h-4 w-3/4 rounded bg-slate-700" />
              <div className="mt-3 h-3 w-1/2 rounded bg-slate-700" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-200">{error}</div>
      ) : movies.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 text-slate-300">No movies matched the current filters.</div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {movies.map((movie) => (
              <Link key={movie.id} to={`/movie/${movie.id}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-lg transition hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-amber-500/10">
                <div className="relative">
                  <img src={movie.posterUrl} alt={movie.title} className="h-80 w-full object-cover transition duration-300 group-hover:scale-[1.02]" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="rounded-full bg-black/50 px-2 py-1 backdrop-blur-sm">⭐ {movie.rating.toFixed(1)}</span>
                    <span className="rounded-full bg-black/50 px-2 py-1 backdrop-blur-sm">{movie.releaseDate.slice(0, 4)}</span>
                  </div>
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="line-clamp-2 text-lg font-semibold text-white">{movie.title}</h3>
                  <p className="text-sm text-slate-400">{movie.genres.length ? movie.genres.slice(0, 2).join(', ') : 'General'}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
              className="rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
