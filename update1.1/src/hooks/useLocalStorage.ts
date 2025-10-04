// FIX: Import React to make the 'React' namespace available for types.
import React, { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = useCallback((value) => {
    try {
      // Use the functional update form of useState's setter to ensure we're using the latest state
      // and to make this callback stable (doesn't need `storedValue` in its dependency array).
      setStoredValue(prevValue => {
        const valueToStore = value instanceof Function ? value(prevValue) : value;
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.error(error);
    }
  }, [key]);
  
  useEffect(() => {
     const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key) {
            try {
                const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
                setStoredValue(newValue);
            } catch(error) {
                console.error(error);
                setStoredValue(initialValue);
            }
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;