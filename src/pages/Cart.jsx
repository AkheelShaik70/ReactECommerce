import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    totalDiscount,
    estimatedTax,
    shipping,
    totalPrice,
  } = useCart();

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    clearCart();
  };

  if (checkoutSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
          <i className="fa-solid fa-check"></i>
        </div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">
          Order Confirmed!
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Thank you for shopping with LuxeMart. Your order has been placed and your confirmation receipt is on the way.
        </p>
        <Link
          to="/"
          onClick={() => setCheckoutSuccess(false)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700"
        >
          <i className="fa-solid fa-bag-shopping"></i> Continue Shopping
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
          <i className="fa-solid fa-cart-shopping"></i>
        </div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-slate-500">
          Explore our curated catalog and add items to your bag to see them here.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-teal-600 transition-colors"
        >
          <i className="fa-solid fa-arrow-left"></i> Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            Shopping Cart
          </h1>
          <p className="text-sm text-slate-500">
            You have {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="self-start sm:self-auto text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50"
        >
          <i className="fa-solid fa-trash-can"></i> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const unitDiscounted =
              item.price * (1 - (item.discountPercentage || 0) / 100);
            return (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <Link
                  to={`/product/${item.id}`}
                  className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200/60 p-2 flex-shrink-0"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.id}`}
                    className="font-heading font-semibold text-slate-900 hover:text-teal-600 text-base truncate block"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-slate-400 capitalize mt-0.5">
                    {item.brand} &bull; {item.category?.replace(/-/g, ' ')}
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-heading font-bold text-slate-900 text-sm">
                      ${unitDiscounted.toFixed(2)}
                    </span>
                    {item.discountPercentage > 0 && (
                      <span className="text-xs text-slate-400 line-through">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity & Remove */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 text-slate-600 hover:text-slate-900"
                      aria-label="Decrease quantity"
                    >
                      <i className="fa-solid fa-minus text-[10px]"></i>
                    </button>
                    <span className="w-9 text-center text-xs font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 text-slate-600 hover:text-slate-900"
                      aria-label="Increase quantity"
                    >
                      <i className="fa-solid fa-plus text-[10px]"></i>
                    </button>
                  </div>

                  <div className="text-right min-w-[72px]">
                    <p className="font-heading font-bold text-slate-900 text-sm">
                      ${(unitDiscounted * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                  >
                    <i className="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 sticky top-24">
          <h2 className="font-heading text-lg font-bold text-slate-900">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm border-b border-slate-100 pb-4">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({totalItems} items)</span>
              <span className="font-medium text-slate-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Savings &amp; Discounts</span>
              <span className="font-medium">-${totalDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Tax (8%)</span>
              <span className="font-medium text-slate-900">
                ${estimatedTax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-medium text-slate-900">
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="font-heading font-bold text-slate-900">
              Total Price
            </span>
            <span className="font-heading text-2xl font-extrabold text-teal-600">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-lock text-xs"></i>
            <span>Proceed to Checkout</span>
          </button>

          <Link
            to="/"
            className="block text-center text-xs font-semibold text-slate-500 hover:text-teal-600"
          >
            <i className="fa-solid fa-arrow-left mr-1"></i> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
