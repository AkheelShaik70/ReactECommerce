import React from 'react';

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden p-4 space-y-4 animate-pulse"
        >
          <div className="aspect-[4/3] w-full bg-slate-200 rounded-xl" />
          <div className="space-y-2">
            <div className="h-3 w-1/3 bg-slate-200 rounded" />
            <div className="h-5 w-3/4 bg-slate-200 rounded" />
            <div className="h-3 w-full bg-slate-200 rounded" />
            <div className="h-3 w-2/3 bg-slate-200 rounded" />
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="h-6 w-20 bg-slate-200 rounded" />
            <div className="h-9 w-24 bg-slate-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProductDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-4 w-36 bg-slate-200 rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200">
        <div className="space-y-4">
          <div className="aspect-square bg-slate-200 rounded-2xl" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-square bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div className="h-5 w-28 bg-slate-200 rounded-full" />
          <div className="h-8 w-3/4 bg-slate-200 rounded" />
          <div className="h-5 w-40 bg-slate-200 rounded" />
          <div className="h-10 w-48 bg-slate-200 rounded" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-2/3 bg-slate-200 rounded" />
          </div>
          <div className="h-12 w-full bg-slate-200 rounded-xl pt-4" />
        </div>
      </div>
    </div>
  );
};
