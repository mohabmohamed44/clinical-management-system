import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Lib/Context/AuthContext';

/**
 * PrivateRoute component restricts access to non-authenticated users
 * and redirects them to the login page, while allowing
 * authenticated users to access the protected route.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.ReactNode} - Either the children or a redirect component
 */
const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading indicator while checking authentication status
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    // Store the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If user is authenticated, allow access to the protected route
  return children;
};

export default PrivateRoute; 