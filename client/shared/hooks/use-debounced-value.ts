"use client";
import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delaysMs = 300) {
  const [debounceValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delaysMs);

    return () => window.clearTimeout(timer);
  }, [value, delaysMs]);

  return debounceValue;
}
