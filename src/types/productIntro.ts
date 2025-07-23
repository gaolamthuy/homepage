/**
 * Types cho giới thiệu sản phẩm
 * Định nghĩa các interface và type cần thiết cho hệ thống giới thiệu sản phẩm
 */

// Interface cho attribute của sản phẩm
export interface ProductAttribute {
  productId: number;
  attributeName: string;
  attributeValue: string;
}

// Interface cho sản phẩm
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Giá gốc (nếu có giảm giá)
  images: string[];
  category: string;
  tags: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  // Thêm attributes đầy đủ
  attributes: ProductAttribute[];
  // Thêm các trường từ API
  fullName?: string;
  code?: string;
  barCode?: string;
  categoryId?: number;
  allowsSale?: boolean;
  type?: number;
  hasVariants?: boolean;
  unit?: string;
  conversionValue?: number;
  isActive?: boolean;
  isLotSerialControl?: boolean;
  isBatchExpireControl?: boolean;
  masterProductId?: number | null;
  // GLT custom fields
  glt?: {
    glt_synced_at?: string;
    glt_custom_image_url?: string;
    glt_sort_order?: number | null;
    glt_tags?: string[] | null;
    glt_note?: string | null;
    glt_visible?: boolean;
    glt_slug?: string;
    glt_image_updated_at?: number | null;
    glt_retail_promotion?: boolean;
    glt_created_at?: string;
    glt_updated_at?: string;
    glt_gallery_thumbnail_title?: string;
    glt_gallery_selected?: any;
    glt_gallery_thumbnail_url?: string | null;
    glt_gallery_zoom_url?: string | null;
    glt_gallery_original_url?: string | null;
    glt_baseprice_markup?: number | null;
  };
}

// Interface cho danh mục sản phẩm
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string; // Cho danh mục con
  children?: Category[];
}

// Interface cho filter sản phẩm
export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  rating?: number;
  tags?: string[];
  search?: string;
  sortBy?: "name" | "price" | "rating" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// Interface cho pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Interface cho response API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: Pagination;
}
