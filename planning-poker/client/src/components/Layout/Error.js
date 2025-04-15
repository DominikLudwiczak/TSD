// src/components/Layout/Error.js
import React from 'react';

const Error = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-lg my-4 text-center">
      <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 className="text-lg font-semibold mb-2">Error</h3>
      <p className="mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;