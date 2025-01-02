import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600">Page Not Found</h2>
      <Link to="/" className="text-blue-500 mt-4">
      <Button />
      </Link>
    </div>
  );
}

export default NotFound;