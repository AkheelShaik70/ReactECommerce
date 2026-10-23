import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [addedFeedback, setAddedFeedback] = useState(false);

  const discountedPrice =
    product.price * (1 - (product.discountPercentage || 0) / 100);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1200);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Thumbnail Wrapper */}
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-[4/3] bg-slate-100 overflow-hidden block"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-500 text-white text-[11px] font-bold tracking-wide shadow-sm">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}

        {/* Rating Pill */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold flex items-center gap-1 shadow-sm">
          <i className="fa-solid fa-star text-amber-400 text-[11px]"></i>
          <span>{Number(product.rating || 4.5).toFixed(1)}</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wider text-teal-600 mb-1">
            <span className="truncate">{product.category?.replace(/-/g, ' ')}</span>
            {product.brand && (
              <span className="text-slate-400 truncate">{product.brand}</span>
            )}
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="font-heading font-semibold text-slate-900 text-base line-clamp-1 group-hover:text-teal-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-lg font-bold text-slate-900">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  ${Number(product.price).toFixed(2)}
                </span>
              )}
            </div>
            <span
              className={`text-[11px] font-medium ${
                product.stock > 5 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              addedFeedback
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-teal-600 text-white disabled:bg-slate-200 disabled:text-slate-400'
            }`}
          >
            <i
              className={`fa-solid ${
                addedFeedback ? 'fa-check' : 'fa-cart-plus'
              }`}
            ></i>
            <span>{addedFeedback ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
