import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlist, isLoading } = useWishlist();

  if (isLoading) {
    return <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 text-slate-300">Loading your wishlist...</div>;
  }

  if (!wishlist.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-10 text-center">
        <h2 className="text-2xl font-semibold text-white">Your wishlist is empty</h2>
        <p className="mt-3 text-slate-300">Save a few titles you want to revisit later.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 font-medium text-slate-950">Browse movies</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Your wishlist</h1>
        <span className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-sm text-slate-300">{wishlist.length} saved</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {wishlist.map((movie) => (
          <Link key={movie.movieId} to={`/movie/${movie.movieId}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-lg transition hover:-translate-y-1 hover:border-amber-400/40">
            <img src={movie.posterPath || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80'} alt={movie.title} className="h-80 w-full object-cover" loading="lazy" />
            <div className="space-y-2 p-4">
              <h3 className="line-clamp-2 text-lg font-semibold text-white">{movie.title}</h3>
              <p className="text-sm text-slate-400">{movie.releaseDate?.slice(0, 4) || 'N/A'} • ⭐ {movie.rating ?? 0}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
