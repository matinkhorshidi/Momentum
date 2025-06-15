import React from 'react';

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex justify-center items-center bg-bg-color z-[9999]">
    <div className="w-10 h-10 border-4 border-border-default rounded-full border-t-accent animate-spin"></div>
  </div>
);

export default LoadingSpinner;
