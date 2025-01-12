import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // If authenticated, render children or nested routes
  return user ? (children || <Outlet />) : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
