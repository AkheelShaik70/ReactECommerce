import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productApi } from '../api/axiosInstance.js';
import { useCart } from '../context/CartContext.jsx';
import { ProductDetailsSkeleton } from '../components/Skeletons.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedBanner, setAddedBanner] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productApi.getProductById(id);
        if (isMounted) {
          setProduct(res.data);
          setSelectedImage(
            res.data.images?.[0] || res.data.thumbnail || ''
          );
          setQuantity(1);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Could not load product details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <ProductDetailsSkeleton />;

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
          <i className="fa-solid fa-circle-exclamation"></i>
        </div>
        <h2 className="font-heading text-2xl font-bold text-slate-900">
          Product Unavailable
        </h2>
        <p className="text-sm text-slate-600">{error || 'Product not found.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-teal-600"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Catalog
        </Link>
      </div>
    );
  }

  const gallery =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail];

  const discountedPrice =
    product.price * (1 - (product.discountPercentage || 0) / 100);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAddedBanner(true);
    setTimeout(() => setAddedBanner(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link to="/" className="hover:text-teal-600 flex items-center gap-1">
          <i className="fa-solid fa-house"></i> Shop
        </Link>
        <span>/</span>
        <span className="capitalize">{product.category?.replace(/-/g, ' ')}</span>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">
          {product.title}
        </span>
      </nav>

      {/* Product Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        {/* Image Gallery & Thumbnail Switcher */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center p-6 overflow-hidden">
            <img
              src={selectedImage || product.thumbnail}
              alt={product.title}
              className="max-h-full max-w-full object-contain transition-all duration-300"
            />
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`aspect-square rounded-xl border p-2 bg-slate-50 overflow-hidden transition-all ${
                    selectedImage === imgUrl
                      ? 'border-teal-600 ring-2 ring-teal-500/20 bg-white'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.title} view ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold uppercase tracking-wider">
                {product.category?.replace(/-/g, ' ')}
              </span>
              {product.brand && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  Brand: {product.brand}
                </span>
              )}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  product.stock > 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                <i className="fa-solid fa-boxes-stacked mr-1"></i>
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : 'Out of Stock'}
              </span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i
                    key={i}
                    className={`fa-solid fa-star ${
                      i < Math.round(product.rating || 4.5)
                        ? 'text-amber-400'
                        : 'text-slate-200'
                    }`}
                  ></i>
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {Number(product.rating || 4.5).toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">
                ({product.reviews?.length || 0} verified reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-heading text-3xl font-extrabold text-slate-900">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-xs font-bold">
                    Save {Math.round(product.discountPercentage)}%
                  </span>
                </>
              )}
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 text-slate-600 hover:text-slate-900"
                  aria-label="Decrease quantity"
                >
                  <i className="fa-solid fa-minus text-xs"></i>
                </button>
                <span className="w-12 text-center font-semibold text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock || 99, q + 1))
                  }
                  className="w-10 h-10 text-slate-600 hover:text-slate-900"
                  aria-label="Increase quantity"
                >
                  <i className="fa-solid fa-plus text-xs"></i>
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="flex-1 py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-cart-plus"></i>
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addToCart(product, quantity);
                  navigate('/cart');
                }}
                className="py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all"
              >
                Buy Now
              </button>
            </div>

            {addedBanner && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between">
                <span>
                  <i className="fa-solid fa-circle-check mr-1.5 text-emerald-600"></i>
                  Added {quantity} &times; {product.title} to your cart!
                </span>
                <Link to="/cart" className="font-bold underline">
                  View Cart
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="space-y-6">
        <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
          <i className="fa-solid fa-comments text-teal-600"></i>
          <span>Customer Reviews ({product.reviews?.length || 0})</span>
        </h2>

        {!product.reviews || product.reviews.length === 0 ? (
          <p className="text-sm text-slate-500 bg-white p-6 rounded-2xl border border-slate-200">
            No customer reviews have been posted for this product yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.reviews.map((rev, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-semibold text-sm text-slate-900">
                      {rev.reviewerName || 'Verified Shopper'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {rev.date
                        ? new Date(rev.date).toLocaleDateString()
                        : 'Verified Purchase'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i
                        key={i}
                        className={`fa-solid fa-star ${
                          i < Math.round(rev.rating || 5)
                            ? 'text-amber-400'
                            : 'text-slate-200'
                        }`}
                      ></i>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetails;
