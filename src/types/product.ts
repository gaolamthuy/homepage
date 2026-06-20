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
  description?: string | null;
  pricebooks?: {
    utdao: number | null;
    whole: number | null;
  };
  glt_images?: Array<{
    id: number;
    url: string;
    thumbnail_url: string | null;
    role: string;
    image_type: string;
    is_thumbnail: boolean;
    width: number | null;
    height: number | null;
  }>;
  child_unit?: {
    unit: string;
    full_name: string;
    base_price: number;
    conversion_value: number;
    price_per_master_unit?: number;
    price_history?: PriceHistoryEntry[];
  };
  child_product?: Array<{
    id: string;
    code: string;
    name: string;
    unit: string;
    glt_slug: string | null;
    full_name: string;
    is_active: boolean;
    base_price: number;
    price_per_master_unit?: number;
    conversion_value: number;
    child_unit: {
      unit: string;
      full_name: string;
      base_price: number;
      conversion_value: number;
      price_per_master_unit?: number;
    };
    glt_images?: Array<{
      id: number;
      url: string;
      thumbnail_url: string | null;
      role: string;
      image_type: string;
      is_thumbnail: boolean;
      width: number | null;
      height: number | null;
    }>;
    category_id: number;
    kiotviet_id: number;
    category_name: string;
    glt_shopee_url: string | null;
    order_template: string | null;
    glt_kiotvietshop_url: string | null;
    glt_retail_promotion: boolean;
    price_history?: PriceHistoryEntry[];
  }>;
  price_history?: PriceHistoryEntry[];
}

export interface PriceHistoryEntry {
  old: number;
  new: number;
  diff: number;
  dir: 'up' | 'down' | null;
  at: string;
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
 * Interface định nghĩa cấu trúc dữ liệu album item từ Supabase view
 */
export interface AlbumItem {
  id: number;
  title: string;
  title_public: string | null;
  type: string;
  path: string;
  rev: number | null;
  rank: number;
  facebook_post_is_selected: boolean;
  public_url: string | null;
  created_at: string;
  updated_at: string | null;
}

/**
 * Interface cho response từ API album_website.json
 */
export interface AlbumData {
  album_website: AlbumItem[];
}
