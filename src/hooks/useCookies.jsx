import { useState, useCallback } from 'react';
import Cookies from 'js-cookie';

/**
 * Custom hook for managing cookies with React
 * 
 * @param {string} key - The cookie key/name
 * @param {any} initialValue - Default value if cookie doesn't exist
 * @param {Object} options - Cookie options (path, expires, secure, etc.)
 * @returns {Array} - [cookieValue, setCookie, removeCookie]
 */
const useCookies = (key, initialValue = '', options = {}) => {
  // Get initial value from cookie or use provided initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = Cookies.get(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading cookie "${key}":`, error);
      return initialValue;
    }
  });

  // Set cookie value
  const setCookie = useCallback((value, cookieOptions = {}) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to cookie
      const mergedOptions = { ...options, ...cookieOptions };
      Cookies.set(key, JSON.stringify(valueToStore), mergedOptions);
      
      // Save state
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Error setting cookie "${key}":`, error);
    }
  }, [key, options, storedValue]);

  // Remove cookie
  const removeCookie = useCallback(() => {
    try {
      Cookies.remove(key, { ...options });
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing cookie "${key}":`, error);
    }
  }, [key, options, initialValue]);

  return [storedValue, setCookie, removeCookie];
};

export default useCookies; 