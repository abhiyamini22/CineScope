import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { Heart, Home, Search, Sparkles } from 'lucide-react';

import { WishlistProvider } from './context/WishlistContext';
import { useWishlist } from './context/useWishlist';
import HomePage from './pages/Home';
import SearchPage from './pages/Search';
import MovieDetailsPage from './pages/MovieDetails';
import WishlistPage from './pages/Wishlist';

const navItems = [
  { to: '/', label: 'Discover', Icon: Home },
  { to: '/search', label: 'Search', Icon: Search },
  { to: '/wishlist', label: 'Wishlist', Icon: Heart },
];

function AppLayout() {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3 text-xl font-semibold tracking-tight text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-rose-500 text-slate-950">
              <Sparkles size={18} />
            </div>
            CineScope
          </NavLink>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-full px-3 py-2 text-sm transition ${
                    isActive ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={16} />
                <span>{label}</span>
                {to === '/wishlist' && wishlist.length > 0 && (
                  <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <WishlistProvider>
        <AppLayout />
      </WishlistProvider>
    </BrowserRouter>
  );
}

export default App;
