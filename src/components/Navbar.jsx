import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const Navbar = () => {
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/');
    }
    setMobileMenuOpen(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-slate-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-bag-shopping text-lg"></i>
            </div>
            <div>
              <span className="font-heading text-xl font-bold tracking-tight text-slate-900">
                Luxe<span className="text-teal-600">Mart</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                Curated Store
              </span>
            </div>
          </Link>

          {/* Global Search Input (Desktop & Tablet) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-4 relative"
          >
            <div className="relative w-full">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, brands, or keywords..."
                aria-label="Search products"
                className="w-full pl-10 pr-20 py-2 text-sm bg-slate-100/90 hover:bg-slate-100 focus:bg-white rounded-full border border-transparent focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all text-slate-800 placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 px-1.5"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-full transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Navigation Links & Cart Trigger */}
          <nav className="flex items-center gap-2 sm:gap-5">
            <Link
              to="/"
              className={`hidden sm:inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-teal-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <i className="fa-solid fa-store text-xs"></i>
              <span>Shop</span>
            </Link>

            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-sm font-medium transition-colors shadow-sm"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <i className="fa-solid fa-cart-shopping text-sm"></i>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-bold flex items-center justify-center shadow">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-medium">Cart</span>
              {totalItems > 0 && (
                <span className="hidden lg:inline text-xs text-slate-300 border-l border-slate-700 pl-2">
                  ${totalPrice.toFixed(2)}
                </span>
              )}
            </Link>

            {/* Mobile Search & Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile search and menu"
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          </nav>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-slate-400 text-sm"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-20 py-2 text-sm bg-slate-100 rounded-full border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1 bg-teal-600 text-white text-xs font-medium rounded-full"
              >
                Go
              </button>
            </form>
            <div className="flex items-center justify-between px-2 pt-1 text-sm">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-medium text-slate-700 hover:text-teal-600"
              >
                <i className="fa-solid fa-house mr-1.5"></i> Home / All Products
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="font-medium text-teal-600"
              >
                <i className="fa-solid fa-cart-shopping mr-1.5"></i> Cart ({totalItems})
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
