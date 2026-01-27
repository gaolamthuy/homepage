/**
 * Types định nghĩa cho sản phẩm và API response
 * Tập trung tất cả interface liên quan đến sản phẩm tại một nơi
 */

/**
 * Interface định nghĩa cấu trúc dữ liệu sản phẩm từ API
 */
export interface Product {
  id: string;
  kiotviet_id: number;
  code: string;
  name: string;
  full_name: string;
  category_id: number;
  category_name: string;
  base_price: number;
  unit: string;
  is_active: boolean;
  order_template: string | null;
  glt_retail_promotion: boolean;
  glt_kiotvietshop_url: string | null;
  glt_shopee_url: string | null;
  glt_slug: string | null;
  /**
   * Ảnh sản phẩm theo cấu trúc API mới
   * Mảng các ảnh với role khác nhau: main, main-thumbnail, etc.
   */
  glt_images?: Array<{
    id: number;
    url: string;
    role: string;
    created_at: string;
    updated_at: string | null;
  }>;
  /**
   * Thông tin đơn vị con (bao 50kg)
   */
  child_unit?: {
    unit: string;
    full_name: string;
    base_price: number;
    conversion_value: number;
    base_price_per_masterunit: number;
  };

  /**
   * Sản phẩm con (variant)
   */
  child_product?: Array<{
    id: string;
    code: string;
    name: string;
    unit: string;
    glt_slug: string | null;
    full_name: string;
    is_active: boolean;
    base_price: number;
    child_unit: {
      unit: string;
      full_name: string;
      base_price: number;
      conversion_value: number;
      base_price_per_masterunit: number;
    };
    glt_images?: Array<{
      id: number;
      url: string;
      role: string;
      created_at: string;
      updated_at: string | null;
    }>;
    category_id: number;
    kiotviet_id: number;
    category_name: string;
    glt_shopee_url: string | null;
    order_template: string | null;
    glt_kiotvietshop_url: string | null;
    glt_retail_promotion: boolean;
  }>;
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
 * Khớp với cấu trúc từ album_website.json
 */
export interface AlbumItem {
  id: string;
  title: string;
  type: string;
  path: string;
  rev: string | null;
  updated_at: string | null;
  created_at: string;
  public_url_with_rev: string;
  r2_dev_url: string;
  title_public?: string;
}

/**
 * Interface cho response từ API album_website.json
 */
export interface AlbumData {
  album_website: AlbumItem[];
}
