import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-surface">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-secondary-500 rounded-full animate-pulse delay-100"></div>
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse delay-200"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading form builder...</p>
      </div>
    </div>
  );
};

export default Loading;