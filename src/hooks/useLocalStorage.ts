import { useState, useEffect, useRef, useCallback } from "react";

// Helper to handle safe JSON parsing
function parseJSON<T>(value: string | null, fallback: T): T {
  if (value === null) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    console.warn("Error parsing JSON from localStorage:", e);
    return fallback;
  }
}

export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceDelay: number = 500
): [T, (value: T | ((val: T) => T)) => void] {
  
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const item = window.localStorage.getItem(key);
    return parseJSON(item, initialValue);
  });

  const timeoutRef = useRef<number | null>(null);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
        }, debounceDelay);
        
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key, storedValue, debounceDelay]
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(parseJSON(event.newValue, initialValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}