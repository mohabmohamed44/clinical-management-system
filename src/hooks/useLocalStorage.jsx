import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key:", key);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  };

  return [storedValue, setValue];
}
