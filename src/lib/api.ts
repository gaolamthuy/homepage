import type { ProductResponse } from "../types/product";
import type { CustomerResponse } from "../types/customer";

export interface CategoryItem {
  category_id: number;
  category_name: string;
  rank?: number;
  homepage_item_count?: number;
  glt_color_border?: string;
  glt_is_active?: boolean;
}
export interface CategoriesResponse {
  categories_data: CategoryItem[];
}

/**
 * Lấy danh sách sản phẩm từ PUBLIC_API_URL
 * @returns Promise<ProductResponse> - Dữ liệu sản phẩm từ API
 * @throws Error nếu PUBLIC_API_URL không được cấu hình hoặc fetch thất bại
 */
export async function getProducts(): Promise<ProductResponse> {
  const baseUrl = import.meta.env.PUBLIC_API_URL;
  if (!baseUrl || baseUrl.trim() === '') {
    throw new Error('PUBLIC_API_URL không được cấu hình trong file .env.local');
  }
  
  // Đảm bảo baseUrl không có trailing slash
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const apiUrl = `${cleanBaseUrl}/products_data.json`;
  
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} khi fetch ${apiUrl}`);
    }
    return (await res.json()) as ProductResponse;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to parse URL')) {
      throw new Error(`URL không hợp lệ: ${apiUrl}. Vui lòng kiểm tra PUBLIC_API_URL trong .env.local`);
    }
    throw error;
  }
}

/**
 * Lấy danh sách danh mục từ PUBLIC_API_URL
 * @returns Promise<CategoriesResponse> - Dữ liệu danh mục từ API
 * @throws Error nếu PUBLIC_API_URL không được cấu hình hoặc fetch thất bại
 */
export async function getCategories(): Promise<CategoriesResponse> {
  const baseUrl = import.meta.env.PUBLIC_API_URL;
  if (!baseUrl || baseUrl.trim() === '') {
    throw new Error('PUBLIC_API_URL không được cấu hình trong file .env.local');
  }
  
  // Đảm bảo baseUrl không có trailing slash
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const apiUrl = `${cleanBaseUrl}/categories_data.json`;
  
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} khi fetch ${apiUrl}`);
    }
    return (await res.json()) as CategoriesResponse;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to parse URL')) {
      throw new Error(`URL không hợp lệ: ${apiUrl}. Vui lòng kiểm tra PUBLIC_API_URL trong .env.local`);
    }
    throw error;
  }
}

/**
 * Lấy danh sách customer với 5 invoice gần nhất từ PUBLIC_API_URL
 * @returns Promise<CustomerResponse> - Dữ liệu customer từ API
 * @throws Error nếu PUBLIC_API_URL không được cấu hình hoặc fetch thất bại
 */
export async function getCustomers(): Promise<CustomerResponse> {
  const baseUrl = import.meta.env.PUBLIC_API_URL;
  if (!baseUrl || baseUrl.trim() === '') {
    throw new Error('PUBLIC_API_URL không được cấu hình trong file .env.local');
  }
  
  // Đảm bảo baseUrl không có trailing slash
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const apiUrl = `${cleanBaseUrl}/customers_data.json`;
  
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} khi fetch ${apiUrl}`);
    }
    return (await res.json()) as CustomerResponse;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to parse URL')) {
      throw new Error(`URL không hợp lệ: ${apiUrl}. Vui lòng kiểm tra PUBLIC_API_URL trong .env.local`);
    }
    throw error;
  }
}
