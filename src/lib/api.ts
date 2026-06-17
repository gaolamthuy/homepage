import { createSupabaseClient } from './supabase';
import type { Product } from '../types/product';

export interface CategoryItem {
  category_id: number;
  category_name: string;
  rank: number;
  glt_color_border: string;
  homepage_item_count?: number | null;
}

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

interface ViewProduct {
  id: string;
  kiotviet_id: number;
  code: string;
  name: string;
  full_name: string;
  category_id: number;
  category_name: string;
  base_price: number;
  unit: string;
  weight: number;
  is_active: boolean;
  order_template: string | null;
  glt_retail_promotion: boolean;
  glt_kiotvietshop_url: string | null;
  glt_shopee_url: string | null;
  glt_slug: string | null;
  glt_sort_order: number | null;
  glt_custom_image_url: string | null;
  description: string | null;
  category_rank: number;
  category_color_border: string;
  pricebooks: Record<string, number> | null;
  glt_images: Array<{
    id: number;
    url: string;
    thumbnail_url: string | null;
    role: string;
    image_type: string;
    is_thumbnail: boolean;
    width: number | null;
    height: number | null;
  }> | null;
  child_products: Array<{
    kiotviet_id: number;
    code: string;
    name: string;
    full_name: string;
    unit: string;
    base_price: number;
    conversion_value: number;
    price_per_master_unit: number | null;
    glt_slug: string | null;
    is_active: boolean;
    images: Array<{
      id: number;
      url: string;
      thumbnail_url: string | null;
      role: string;
      image_type: string;
      is_thumbnail: boolean;
      width: number | null;
      height: number | null;
    }>;
  }> | null;
}

function transformProduct(row: ViewProduct): Product {
  const firstChild = row.child_products?.[0];
  const child_unit = firstChild
    ? {
        unit: firstChild.unit,
        full_name: firstChild.full_name,
        base_price: Number(firstChild.base_price),
        conversion_value: firstChild.conversion_value,
        price_per_master_unit: firstChild.price_per_master_unit ?? undefined,
      }
    : undefined;

  const pricebooks: Record<string, { price: number }> = {};
  if (row.pricebooks) {
    for (const [name, price] of Object.entries(row.pricebooks)) {
      if (price != null) {
        pricebooks[name] = { price: Number(price) };
      }
    }
  }

  return {
    id: row.id,
    kiotviet_id: row.kiotviet_id,
    code: row.code,
    name: row.name,
    full_name: row.full_name,
    category_id: row.category_id,
    category_name: row.category_name,
    base_price: Number(row.base_price),
    unit: row.unit,
    is_active: row.is_active,
    order_template: row.order_template,
    glt_retail_promotion: row.glt_retail_promotion,
    glt_kiotvietshop_url: row.glt_kiotvietshop_url,
    glt_shopee_url: row.glt_shopee_url,
    glt_slug: row.glt_slug,
    pricebooks: pricebooks as any,
    glt_images: (row.glt_images || []).map((img) => ({
      id: img.id,
      url: img.url,
      thumbnail_url: img.thumbnail_url,
      role: img.role,
      image_type: img.image_type,
      is_thumbnail: img.is_thumbnail,
      width: img.width,
      height: img.height,
    })),
    child_unit,
    child_product: (row.child_products || []).map((cp) => ({
      id: cp.kiotviet_id?.toString(),
      code: cp.code,
      name: cp.name,
      full_name: cp.full_name,
      unit: cp.unit,
      glt_slug: cp.glt_slug,
      is_active: cp.is_active,
      base_price: Number(cp.base_price),
      price_per_master_unit: cp.price_per_master_unit ?? undefined,
      conversion_value: cp.conversion_value,
      child_unit: undefined as any,
      category_id: row.category_id,
      kiotviet_id: cp.kiotviet_id,
      category_name: row.category_name,
      glt_shopee_url: row.glt_shopee_url,
      order_template: row.order_template,
      glt_kiotvietshop_url: row.glt_kiotvietshop_url,
      glt_retail_promotion: row.glt_retail_promotion,
      glt_images: (cp.images || []).map((img) => ({
        id: img.id,
        url: img.url,
        thumbnail_url: img.thumbnail_url,
        role: img.role,
        image_type: img.image_type,
        is_thumbnail: img.is_thumbnail,
        width: img.width,
        height: img.height,
      })),
    })),
  };
}

export async function getProducts(): Promise<{ products_data: Product[] }> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('v_products_homepage')
    .select('*');
  if (error) {
    throw new Error(`Supabase query v_products_homepage failed: ${error.message}`);
  }
  return { products_data: (data || []).map(transformProduct) };
}

export async function getCategories(): Promise<{
  categories_data: CategoryItem[];
}> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('v_homepage_categories')
    .select('*');
  if (error) {
    throw new Error(
      `Supabase query v_homepage_categories failed: ${error.message}`
    );
  }
  return { categories_data: data || [] };
}

export async function getAlbum(): Promise<AlbumItem[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('v_homepage_album')
    .select('*');
  if (error) {
    throw new Error(
      `Supabase query v_homepage_album failed: ${error.message}`
    );
  }
  return (data || []) as AlbumItem[];
}

export interface SocialImageItem {
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

export async function getSocialImages(): Promise<SocialImageItem[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('v_social_images_homepage')
    .select('*');
  if (error) {
    throw new Error(
      `Supabase query v_social_images_homepage failed: ${error.message}`
    );
  }
  return (data || []) as SocialImageItem[];
}
