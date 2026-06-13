-- v_products_homepage: View for Astro homepage build-time data fetching
-- Replaces: v_homepage_products (dropped)
-- Source tables: kv_products, glt_product_images (image_type='display'), kv_product_pricebooks, kv_product_categories

CREATE OR REPLACE VIEW v_products_homepage AS
WITH product_images AS (
  SELECT pi.product_id,
    jsonb_agg(
      jsonb_build_object(
        'id', pi.id,
        'url', 'https://wvckxasjbydyvqgwgdhg.supabase.co/storage/v1/object/public/product-images/' || pi.path || CASE WHEN pi.rev IS NOT NULL THEN '?t=' || pi.rev ELSE '' END,
        'thumbnail_url',
          'https://imagor.hophamlam.com/unsafe/fit-in/300x400/filters:format(webp):quality(80)/wvckxasjbydyvqgwgdhg.supabase.co/storage/v1/object/public/product-images/' || pi.path || CASE WHEN pi.rev IS NOT NULL THEN '?t=' || pi.rev ELSE '' END,
        'role', pi.role,
        'image_type', pi.image_type,
        'is_thumbnail', pi.is_thumbnail,
        'width', pi.width,
        'height', pi.height
      ) ORDER BY pi.is_thumbnail DESC, pi.id
    ) AS images
  FROM glt_product_images pi
  WHERE pi.image_type = 'display'
  GROUP BY pi.product_id
),
product_pricebooks AS (
  SELECT ppb.product_id,
    jsonb_object_agg(pb.name, ppb.price) AS pricebooks
  FROM kv_product_pricebooks ppb
  JOIN kv_pricebooks pb ON ppb.pricebook_id = pb.id
  WHERE ppb.is_active = true AND pb.is_active = true
  GROUP BY ppb.product_id
),
child_products_agg AS (
  SELECT cp.master_product_id,
    jsonb_agg(
      jsonb_build_object(
        'kiotviet_id', cp.kiotviet_id,
        'code', cp.code,
        'name', cp.name,
        'full_name', cp.full_name,
        'unit', cp.unit,
        'base_price', cp.base_price,
        'conversion_value', cp.conversion_value,
        'price_per_master_unit', CASE WHEN cp.conversion_value > 0 THEN round(cp.base_price / cp.conversion_value::numeric, 3) ELSE NULL END,
        'glt_slug', cp.glt_slug,
        'is_active', cp.is_active,
        'images', COALESCE(cpi.images, '[]'::jsonb)
      ) ORDER BY cp.conversion_value
    ) AS child_products
  FROM kv_products cp
  LEFT JOIN product_images cpi ON cpi.product_id = cp.kiotviet_id
  WHERE cp.is_active = true AND COALESCE(cp.is_deleted, false) = false AND cp.master_product_id IS NOT NULL
  GROUP BY cp.master_product_id
)
SELECT
  p.id::text AS id,
  p.kiotviet_id,
  p.code,
  p.name,
  p.full_name,
  p.category_id,
  p.category_name,
  p.base_price,
  p.unit,
  p.weight,
  p.is_active,
  p.order_template,
  p.glt_retail_promotion,
  p.glt_kiotvietshop_url,
  p.glt_shopee_url,
  p.glt_slug,
  p.glt_sort_order,
  p.glt_custom_image_url,
  p.description,
  c.rank AS category_rank,
  c.glt_color_border AS category_color_border,
  COALESCE(ppb.pricebooks, '{}'::jsonb) AS pricebooks,
  COALESCE(pi.images, '[]'::jsonb) AS glt_images,
  COALESCE(cpa.child_products, '[]'::jsonb) AS child_products
FROM kv_products p
LEFT JOIN kv_product_categories c ON p.category_id = c.category_id
LEFT JOIN product_pricebooks ppb ON ppb.product_id = p.id
LEFT JOIN product_images pi ON pi.product_id = p.kiotviet_id
LEFT JOIN child_products_agg cpa ON cpa.master_product_id = p.kiotviet_id
WHERE p.is_active = true
  AND COALESCE(p.is_deleted, false) = false
  AND COALESCE(p.allows_sale, false) = true
  AND p.master_product_id IS NULL
  AND COALESCE(c.glt_is_active, false) = true
ORDER BY c.rank, p.glt_sort_order, p.name;
