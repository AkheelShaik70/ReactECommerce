import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi } from '../api/axiosInstance.js';
import ProductCard from '../components/ProductCard.jsx';
import { ProductGridSkeleton } from '../components/Skeletons.jsx';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync URL query param
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    setSearchInput(urlQ);
    setDebouncedQuery(urlQ);
    if (urlQ) {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  // Debounce local search input (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Load Category List once
  useEffect(() => {
    let isMounted = true;
    productApi
      .getCategoryList()
      .then((res) => {
        if (isMounted && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      })
      .catch(() => {
        // Non-blocking if category list fails
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch products based on active search or selected category
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (debouncedQuery) {
          response = await productApi.searchProducts(debouncedQuery);
        } else if (selectedCategory && selectedCategory !== 'all') {
          response = await productApi.getProductsByCategory(selectedCategory);
        } else {
          response = await productApi.getAllProducts(24, 0);
        }
        if (isMounted) {
          setProducts(response.data?.products || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load products.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchInput('');
    setDebouncedQuery('');
    if (searchParams.get('q')) {
      setSearchParams({});
    }
  };

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating-desc') {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  }, [products, sortBy]);

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Banner */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-widest">
              <i className="fa-solid fa-bolt"></i> Autumn / Winter Curated Drop
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Elevated Essentials for <span className="text-teal-400">Modern Living.</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore top-rated tech, minimalist home decor, beauty essentials, and designer accessories with instant filtering and live cart persistence.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#catalog-section"
                className="px-6 py-3 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm transition-all shadow-lg inline-flex items-center gap-2"
              >
                <span>Explore Collection</span>
                <i className="fa-solid fa-arrow-down text-xs"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Controls & Grid */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search + Sort Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Filter products by keyword (e.g., laptop, perfume, watch)..."
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setDebouncedQuery('');
                  setSearchParams({});
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <i className="fa-solid fa-circle-xmark"></i>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sort-select" className="text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              <i className="fa-solid fa-arrow-up-wide-short mr-1 text-teal-600"></i>
              Sort By:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 md:w-52 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-teal-500"
            >
              <option value="default">Featured (Default)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all' && !debouncedQuery
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-500'
            }`}
          >
            All Categories
          </button>
          {categories.slice(0, 14).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                selectedCategory === cat && !debouncedQuery
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-500'
              }`}
            >
              {cat.replace(/-/g, ' ')}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
            <i className="fa-solid fa-triangle-exclamation text-rose-500 text-2xl"></i>
            <h3 className="font-heading font-semibold text-rose-900">Unable to Load Products</h3>
            <p className="text-sm text-rose-700 max-w-md mx-auto">{error}</p>
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
            >
              Retry Fetching Catalog
            </button>
          </div>
        )}

        {/* Skeleton or Product Grid */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : sortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
              <i className="fa-solid fa-box-open"></i>
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-900">No Matching Products Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              We couldn't find any items matching "{debouncedQuery || selectedCategory}". Try clearing your search filter.
            </p>
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className="px-5 py-2.5 rounded-full bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
