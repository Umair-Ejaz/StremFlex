import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, Upload, Shield, LogOut, Video } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();             // Clears state and localStorage
    navigate('/login');   // Redirects user back to login page
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800/80 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sm:gap-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="p-2 bg-gradient-to-tr from-red-600 to-red-500 rounded-2xl text-white group-hover:scale-105 transition-transform shadow-md shadow-red-500/20">
            <Film className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent tracking-tight">
            StreamFlix
          </span>
        </Link>

        {/* Center Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search videos, creators, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-gray-100/80 dark:bg-slate-800/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-full border border-transparent focus:border-red-500/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all shadow-inner"
            />
          </div>
        </form>

        {/* Right User Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Admin Panel Link Badge (Shown for Admin Role) */}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs font-semibold transition-all shadow-xs"
                  title="Admin Dashboard"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="hidden lg:inline">Admin Panel</span>
                </Link>
              )}

              {/* Upload Video Button */}
              <Link
                to="/upload"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-slate-800/60 rounded-xl transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </Link>

              {/* My Videos Link */}
              <Link
                to="/my-uploads"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-slate-800/60 rounded-xl transition-all"
              >
                <Video className="w-4 h-4" />
                <span>My Videos</span>
              </Link>

              {/* User Profile & Sign Out Group */}
              <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-slate-800">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 max-w-[100px] truncate leading-tight">
                    {user.username}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 tracking-wider">
                    {user.role || 'Creator'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-red-500/20 active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-red-500/20 active:scale-95"
              >
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;