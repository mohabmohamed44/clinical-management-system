import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Lib/Context/AuthContext';

/**
 * PublicRoute component restricts access to authenticated users
 * and redirects them to the home page, while allowing
 * non-authenticated users to access the route.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.ReactNode} - Either the children or a redirect component
 */
const PublicRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading indicator while checking authentication status
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If user is authenticated, redirect to home page
  if (isAuthenticated) {
    // Redirect to the page they were trying to access before being redirected to login page
    // Or to the home page if there's no stored location
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }
  
  // If user is not authenticated, allow access to the public route
  return children;
};

export default PublicRoute;
