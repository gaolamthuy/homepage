/**
 * Custom hook cho debounce
 * Tối ưu performance cho search và filter operations
 */

import { useState, useEffect } from 'react';

/**
 * Hook debounce cho value
 * @param value - Giá trị cần debounce
 * @param delay - Thời gian delay (milliseconds)
 * @returns Giá trị đã được debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout để update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout nếu value thay đổi trước khi delay kết thúc
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook debounce cho function
 * @param callback - Function cần debounce
 * @param delay - Thời gian delay (milliseconds)
 * @returns Function đã được debounce
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = ((...args: Parameters<T>) => {
    // Clear timeout cũ nếu có
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set timeout mới
    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  }) as T;

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return debouncedCallback;
}
