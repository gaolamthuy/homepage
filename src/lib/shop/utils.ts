/**
 * Utility functions cho shop online
 * Các hàm tiện ích để xử lý dữ liệu sản phẩm
 */

import type { Product, ProductAttribute } from "@/types/shop";

/**
 * Format giá tiền theo định dạng Việt Nam
 * @param price - Giá tiền (number)
 * @returns String giá tiền đã format
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

/**
 * Format rating theo định dạng số thập phân
 * @param rating - Rating (number)
 * @returns String rating đã format
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Kiểm tra sản phẩm có giảm giá không
 * @param product - Sản phẩm cần kiểm tra
 * @returns Boolean
 */
export function hasDiscount(product: Product): boolean {
  return (
    product.originalPrice !== undefined && product.originalPrice > product.price
  );
}

/**
 * Tính phần trăm giảm giá
 * @param product - Sản phẩm cần tính
 * @returns Phần trăm giảm giá
 */
export function getDiscountPercentage(product: Product): number {
  if (!hasDiscount(product) || !product.originalPrice) return 0;
  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
}

/**
 * Group attributes theo attributeName
 * @param attributes - Array các attributes
 * @returns Map với key là attributeName, value là array các attributeValue
 */
export function groupAttributesByName(
  attributes: ProductAttribute[]
): Map<string, string[]> {
  const groups = new Map<string, string[]>();

  attributes.forEach((attr) => {
    const { attributeName, attributeValue } = attr;
    if (!groups.has(attributeName)) {
      groups.set(attributeName, []);
    }
    // Chỉ thêm nếu chưa có value này
    if (!groups.get(attributeName)!.includes(attributeValue)) {
      groups.get(attributeName)!.push(attributeValue);
    }
  });

  return groups;
}

/**
 * Lấy tất cả attribute names từ sản phẩm
 * @param product - Sản phẩm cần lấy
 * @returns Array các attribute names
 */
export function getAttributeNames(product: Product): string[] {
  if (!product.attributes || product.attributes.length === 0) return [];
  return [...new Set(product.attributes.map((attr) => attr.attributeName))];
}

/**
 * Lấy tất cả attribute values theo name
 * @param product - Sản phẩm cần lấy
 * @param attributeName - Tên attribute cần lấy values
 * @returns Array các attribute values
 */
export function getAttributeValues(
  product: Product,
  attributeName: string
): string[] {
  if (!product.attributes || product.attributes.length === 0) return [];
  return product.attributes
    .filter((attr) => attr.attributeName === attributeName)
    .map((attr) => attr.attributeValue);
}

/**
 * Kiểm tra sản phẩm có attribute với value cụ thể không
 * @param product - Sản phẩm cần kiểm tra
 * @param attributeName - Tên attribute
 * @param attributeValue - Giá trị cần kiểm tra
 * @returns Boolean
 */
export function hasAttributeValue(
  product: Product,
  attributeName: string,
  attributeValue: string
): boolean {
  if (!product.attributes || product.attributes.length === 0) return false;
  return product.attributes.some(
    (attr) =>
      attr.attributeName === attributeName &&
      attr.attributeValue === attributeValue
  );
}

/**
 * Lấy sản phẩm theo attribute filter
 * @param products - Danh sách sản phẩm
 * @param attributeName - Tên attribute cần filter
 * @param attributeValue - Giá trị cần filter
 * @returns Array sản phẩm thỏa mãn
 */
export function filterProductsByAttribute(
  products: Product[],
  attributeName: string,
  attributeValue: string
): Product[] {
  return products.filter((product) =>
    hasAttributeValue(product, attributeName, attributeValue)
  );
}

/**
 * Tạo object để hiển thị attributes dạng key-value
 * @param attributes - Array các attributes
 * @returns Object với key là attributeName, value là array các attributeValue
 */
export function createAttributeDisplayObject(
  attributes: ProductAttribute[]
): Record<string, string[]> {
  const groups = groupAttributesByName(attributes);
  const result: Record<string, string[]> = {};

  groups.forEach((values, name) => {
    result[name] = values;
  });

  return result;
}

/**
 * Sort products theo thứ tự categoryName cụ thể
 * @param products - Danh sách sản phẩm cần sort
 * @param categoryOrder - Thứ tự categoryName mong muốn
 * @returns Danh sách sản phẩm đã được sort
 */
export function sortProductsByCategory(
  products: Product[],
  categoryOrder: string[] = [
    "Gạo nở",
    "Gạo dẻo",
    "Gạo chính hãng",
    "Tấm",
    "Nếp",
    "Lúa - Gạo Lứt",
    "test",
  ]
): Product[] {
  return products.sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.category);
    const bIndex = categoryOrder.indexOf(b.category);

    // Nếu cả hai category đều có trong danh sách, sort theo index
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    // Nếu chỉ một category có trong danh sách, đưa lên đầu
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    // Nếu cả hai đều không có, sort theo tên category
    return a.category.localeCompare(b.category);
  });
}

/**
 * Sort products 2 cấp: theo categoryName trước, rồi theo basePrice tăng dần
 * @param products - Danh sách sản phẩm cần sort
 * @param categoryOrder - Thứ tự categoryName mong muốn
 * @returns Danh sách sản phẩm đã được sort 2 cấp
 */
export function sortProductsByCategoryAndPrice(
  products: Product[],
  categoryOrder: string[] = [
    "Gạo nở",
    "Gạo dẻo",
    "Gạo chính hãng",
    "Tấm",
    "Nếp",
    "Lúa - Gạo Lứt",
    "test",
  ]
): Product[] {
  return products.sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.category);
    const bIndex = categoryOrder.indexOf(b.category);

    // Cấp 1: Sort theo category
    if (aIndex !== -1 && bIndex !== -1) {
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
    } else if (aIndex !== -1) {
      return -1;
    } else if (bIndex !== -1) {
      return 1;
    } else if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }

    // Cấp 2: Nếu cùng category, sort theo basePrice tăng dần
    return (a.price || 0) - (b.price || 0);
  });
}

/**
 * Sort products 2 cấp: theo categoryName trước, rồi theo name
 * @param products - Danh sách sản phẩm cần sort
 * @param categoryOrder - Thứ tự categoryName mong muốn
 * @returns Danh sách sản phẩm đã được sort 2 cấp
 */
export function sortProductsByCategoryAndName(
  products: Product[],
  categoryOrder: string[] = [
    "Gạo nở",
    "Gạo dẻo",
    "Gạo chính hãng",
    "Tấm",
    "Nếp",
    "Lúa - Gạo Lứt",
    "test",
  ]
): Product[] {
  return products.sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.category);
    const bIndex = categoryOrder.indexOf(b.category);

    // Cấp 1: Sort theo category
    if (aIndex !== -1 && bIndex !== -1) {
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
    } else if (aIndex !== -1) {
      return -1;
    } else if (bIndex !== -1) {
      return 1;
    } else if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }

    // Cấp 2: Nếu cùng category, sort theo name
    return a.name.localeCompare(b.name);
  });
}

/**
 * Group products theo category và sort trong mỗi group
 * @param products - Danh sách sản phẩm
 * @param categoryOrder - Thứ tự categoryName mong muốn
 * @returns Object với key là categoryName, value là array products đã sort
 */
export function groupAndSortProducts(
  products: Product[],
  categoryOrder: string[] = [
    "Gạo nở",
    "Gạo dẻo",
    "Gạo chính hãng",
    "Tấm",
    "Nếp",
    "Lúa - Gạo Lứt",
    "test",
  ]
): Record<string, Product[]> {
  // Group products theo category
  const grouped = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Sort products trong mỗi group theo name
  Object.keys(grouped).forEach((category) => {
    grouped[category].sort((a, b) => a.name.localeCompare(b.name));
  });

  // Tạo object mới với thứ tự category đúng
  const result: Record<string, Product[]> = {};
  categoryOrder.forEach((category) => {
    if (grouped[category]) {
      result[category] = grouped[category];
    }
  });

  // Thêm các category không có trong categoryOrder
  Object.keys(grouped).forEach((category) => {
    if (!categoryOrder.includes(category)) {
      result[category] = grouped[category];
    }
  });

  return result;
}

// Hàm lấy tất cả attributes từ master product và variants
export function getAllAttributesForMaster(
  masterProductId: number,
  allProductsFromAPI: any[]
): any[] {
  const relatedProducts = allProductsFromAPI.filter(
    (product) =>
      product.id === masterProductId ||
      product.masterProductId === masterProductId
  );
  return relatedProducts.flatMap((product) => product.attributes || []);
}
