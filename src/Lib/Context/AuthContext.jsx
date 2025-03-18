import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
// Create the authentication context
const AuthContext = createContext();

/**
 * AuthProvider component provides authentication state to the application
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactNode} - Context provider with children
 */
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for token in localStorage
        const token = Cookies.get('authToken');
        
        if (token) {
          // Validate token with your API (example)
          // const response = await fetch('/api/auth/validate-token', {
          //   headers: { Authorization: `Bearer ${token}` }
          // });
          
          // if (response.ok) {
          //   const userData = await response.json();
          //   setUser(userData);
          //   setIsAuthenticated(true);
          // } else {
          //   // Token invalid, clear storage
          //   localStorage.removeItem('authToken');
          //   setIsAuthenticated(false);
          //   setUser(null);
          // }

          // For now, just set auth to true if token exists
          setIsAuthenticated(true);
          // Mock user data
          setUser({ id: 1, name: 'User' });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Call your API to authenticate user
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      
      // if (response.ok) {
      //   const data = await response.json();
      //   localStorage.setItem('authToken', data.token);
      //   setUser(data.user);
      //   setIsAuthenticated(true);
      //   return { success: true };
      // } else {
      //   const error = await response.json();
      //   return { success: false, message: error.message };
      // }

      // Mock successful login
      localStorage.setItem('authToken', 'mock-token');
      setUser({ id: 1, name: credentials.email });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'An error occurred during login.' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Call your API to register user
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // });
      
      // if (response.ok) {
      //   const data = await response.json();
      //   return { success: true, data };
      // } else {
      //   const error = await response.json();
      //   return { success: false, message: error.message };
      // }

      // Mock successful registration
      return { success: true, data: { message: 'Registration successful' } };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: 'An error occurred during registration.' };
    } finally {
      setLoading(false);
    }
  };

  // Value to be provided to consumers
  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use the auth context
 * 
 * @returns {Object} Auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 