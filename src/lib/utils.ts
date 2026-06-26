import type { Product } from '../types/product';

const IMAGE_ROLES = ['closeup', 'package'] as const;

const ROLE_PRIORITY: Record<string, number> = {
  closeup: 0,
  package: 1,
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price);
}

const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export function formatVnd(price: number): string {
  return VND.format(price);
}

export function getProductImage(product: Product, useThumbnail = false): string {
  if (product.glt_images && product.glt_images.length > 0) {
    const filtered = product.glt_images.filter((img) =>
      IMAGE_ROLES.includes(img.role as any)
    );

    if (filtered.length > 0) {
      filtered.sort(
        (a, b) =>
          (ROLE_PRIORITY[a.role] ?? 99) - (ROLE_PRIORITY[b.role] ?? 99)
      );
      if (useThumbnail && filtered[0].thumbnail_url) {
        return filtered[0].thumbnail_url;
      }
      return filtered[0].url;
    }

    if (useThumbnail && product.glt_images[0].thumbnail_url) {
      return product.glt_images[0].thumbnail_url;
    }
    return product.glt_images[0].url;
  }

  return 'https://placehold.co/300x400/EEE/999?text=No+Image';
}

export function getFilteredProductImages(
  product: Product
): Array<{ id: number; url: string; thumbnail_url: string | null; role: string }> {
  if (!product.glt_images || product.glt_images.length === 0) return [];
  return product.glt_images.filter((img) =>
    IMAGE_ROLES.includes(img.role as any)
  );
}
