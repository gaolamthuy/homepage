/**
 * API Client cho shop
 * Xử lý tất cả API calls với error handling và retry logic
 */

import type { ApiResponse } from '@/types/shop';

// API Configuration
const API_CONFIG = {
  baseUrl: import.meta.env.PUBLIC_API_URL,
  timeout: 10000, // 10 seconds
  retries: 3,
  retryDelay: 1000 // 1 second
};

/**
 * Custom error class cho API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Delay function cho retry logic
 * @param ms - Thời gian delay (milliseconds)
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch với timeout
 * @param url - URL để fetch
 * @param options - Fetch options
 * @param timeout - Timeout duration
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = API_CONFIG.timeout
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    throw error;
  }
}

/**
 * Retry logic cho API calls
 * @param fn - Function để retry
 * @param retries - Số lần retry
 * @param delay - Delay giữa các lần retry
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = API_CONFIG.retries,
  delayMs: number = API_CONFIG.retryDelay
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error instanceof ApiError && error.status >= 500) {
      await delay(delayMs);
      return withRetry(fn, retries - 1, delayMs * 2);
    }
    throw error;
  }
}

/**
 * Parse API response
 * @param response - Fetch response
 */
async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Ignore JSON parse error, use default message
    }
    
    throw new ApiError(errorMessage, response.status);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new ApiError('Invalid JSON response', response.status);
  }
}

/**
 * Generic API request function
 * @param endpoint - API endpoint
 * @param options - Request options
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  
  return withRetry(async () => {
    const response = await fetchWithTimeout(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    return parseResponse<T>(response);
  });
}

/**
 * Fetch products từ API với error handling
 * @returns Promise với danh sách products
 */
export async function fetchProducts(): Promise<any[]> {
  try {
    const timestamp = Date.now();
    const endpoint = `?t=${timestamp}`;
    const data = await apiRequest<any>(endpoint, { cache: 'no-store' });
    return data.products || [];
  } catch (error) {
    console.error('Lỗi khi fetch products:', error);
    
    if (error instanceof ApiError) {
      // Log chi tiết lỗi
      console.error(`API Error ${error.status}: ${error.message}`);
      
      // Có thể thêm error reporting service ở đây
      // reportError(error);
    }
    
    // Return empty array để tránh crash UI
    return [];
  }
}

/**
 * Fetch categories từ API với error handling
 * @returns Promise với danh sách categories
 */
export async function fetchCategories(): Promise<any[]> {
  try {
    const timestamp = Date.now();
    const endpoint = `?t=${timestamp}`;
    const data = await apiRequest<any>(endpoint, { cache: 'no-store' });
    
    const categoriesData = data.product_categories || [];
    
    // Filter chỉ lấy active categories
    return categoriesData.filter((cat: any) => cat.glt?.glt_is_active === true);
  } catch (error) {
    console.error('Lỗi khi fetch categories:', error);
    
    if (error instanceof ApiError) {
      console.error(`API Error ${error.status}: ${error.message}`);
    }
    
    return [];
  }
}

/**
 * Health check API
 * @returns Promise với health status
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const timestamp = Date.now();
    const endpoint = `?t=${timestamp}`;
    await apiRequest(endpoint, { cache: 'no-store' });
    return true;
  } catch (error) {
    console.error('API Health check failed:', error);
    return false;
  }
}
