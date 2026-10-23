import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <i className="fa-solid fa-bag-shopping text-sm"></i>
              </div>
              <span className="font-heading text-lg font-bold text-white">
                Luxe<span className="text-teal-400">Mart</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Modern Single Page E-Commerce Application powered by React, React Router v6, Tailwind CSS, and the DummyJSON REST API.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">
                  Shop Catalog
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-teal-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Customer Care
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-truck-fast text-teal-400 text-xs"></i>
                <span>Free shipping over $100</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-shield-halved text-teal-400 text-xs"></i>
                <span>30-Day Money-Back Guarantee</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-lock text-teal-400 text-xs"></i>
                <span>256-Bit Encrypted Checkout</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} LuxeMart SPA. Built with React &amp; Tailwind CSS.</p>
          <p className="flex items-center gap-2">
            <span>API Data:</span>
            <a
              href="https://dummyjson.com/products"
              target="_blank"
              rel="noreferrer"
              className="text-teal-400 hover:underline"
            >
              dummyjson.com/products
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
