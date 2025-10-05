/**
 * Types định nghĩa cho sản phẩm và API response
 * Tập trung tất cả interface liên quan đến sản phẩm tại một nơi
 */

/**
 * Interface định nghĩa cấu trúc dữ liệu sản phẩm từ API
 */
export interface Product {
  id: number;
  kiotviet_id: number;
  code: string;
  name: string;
  full_name: string;
  category_id: string;
  category_name: string;
  has_variants: boolean;
  base_price: number;
  unit: string;
  master_product_id: number | null;
  master_unit_id: number | null;
  conversion_value: number;
  order_template: string | null;
  images: string[];
  glt_gallery_thumbnail_url: string | null;
  glt_gallery_zoom_url: string | null;
  glt_retail_promotion: boolean;
  glt_kiotvietshop_url: string | null;
  glt_shopee_url: string | null;
  /**
   * Slug nội bộ để tạo trang chi tiết sản phẩm
   * Ví dụ: "nang-hoa-tieu-chuan-kg"
   */
  glt_slug?: string | null;
  child_unit?: {
    base_price: number;
    conversion_value: number;
    unit: string;
    full_name: string;
    base_price_per_masterunit: number;
  };
  child_product?: {
    base_price: number;
    conversion_value: number;
    unit: string;
    full_name: string;
    base_price_per_masterunit: number;
    order_template: string | null;
    child_unit: {
      base_price: number;
      conversion_value: number;
      unit: string;
      full_name: string;
      base_price_per_masterunit: number;
    };
  };
}

/**
 * Interface cho response từ API products_data.json
 */
export interface ProductResponse {
  products_data: Product[];
}

/**
 * Interface cho props của ProductCard component
 */
export interface ProductCardProps {
  product: Product;
}

/**
 * Interface cho props của Layout component
 */
export interface LayoutProps {
  title?: string;
  description?: string;
}

/**
 * Interface định nghĩa cấu trúc dữ liệu album item từ API
 */
export interface AlbumItem {
  id: number;
  created_at: string;
  title: string;
  url: string;
  type: string;
  updated_at: string;
  s3_searchkey: string;
}

/**
 * Interface cho response từ API album_website.json
 */
export interface AlbumData {
  album_website: AlbumItem[];
}
