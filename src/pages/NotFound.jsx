import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-5">
      <div className="w-20 h-20 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-3xl font-heading font-extrabold shadow-sm">
        404
      </div>
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 leading-relaxed">
        The page you are looking for might have been moved, renamed, or doesn't exist. Let's get you back to the storefront.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-teal-600 text-white text-sm font-semibold transition-colors shadow-sm"
      >
        <i className="fa-solid fa-house"></i> Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
