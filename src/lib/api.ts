import type { ProductResponse } from "../types/product";

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
 */
export async function getProducts(): Promise<ProductResponse> {
  const apiUrl = import.meta.env.PUBLIC_API_URL + "/products_data.json";
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return (await res.json()) as ProductResponse;
}

/**
 * Lấy danh sách danh mục từ PUBLIC_API_URL
 */
export async function getCategories(): Promise<CategoriesResponse> {
  const apiUrl = import.meta.env.PUBLIC_API_URL + "/categories_data.json";
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return (await res.json()) as CategoriesResponse;
}
