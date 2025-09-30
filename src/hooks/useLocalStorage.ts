import { useState, useEffect, Dispatch, SetStateAction } from 'react';

/**
 * A custom hook to synchronize state with the browser's local storage.
 * It retrieves the stored value from local storage on initial render
 * and updates it whenever the state changes. It also listens for
 * storage events to sync the state across multiple tabs/windows.
 *
 * @template T The type of the value to be stored.
 * @param {string} key The key under which the value is stored in local storage.
 * @param {T} initialValue The initial value to use if no value is found in local storage.
 * @returns {[T, Dispatch<SetStateAction<T>>]} A stateful value, and a function to update it.
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue: Dispatch<SetStateAction<T>> = (value: SetStateAction<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };
  
  useEffect(() => {
     const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key) {
            try {
                const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
                setStoredValue(newValue);
            } catch(error) {
                console.error("Error handling storage change:", error);
                setStoredValue(initialValue);
            }
        }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;