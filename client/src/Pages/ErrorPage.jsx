import React from 'react';
import { useNavigate } from 'react-router-dom';

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <div className="text-center p-8">
        <h1 className="text-9xl font-extrabold text-blue-600 mb-4 animate-bounce">
          404
        </h1>
        <h2 className="text-4xl font-semibold mb-2">
          Oops! Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 text-white font-medium rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 shadow-md"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;