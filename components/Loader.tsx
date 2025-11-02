
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-slate-300 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 text-lg">Finding the best deals for you...</p>
    </div>
  );
};

export default Loader;
