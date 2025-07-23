/**
 * Component ProductGrid
 * Hiển thị grid sản phẩm với attributes đầy đủ từ master + variants
 */

import React from "react";
import type { Product } from "@/types/shop";
import {
  groupAttributesByName,
  getAllAttributesForMaster,
} from "../../lib/shop/utils";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  allProductsFromAPI?: any[]; // Tất cả sản phẩm từ API để lấy attributes variants
  showAttributes?: boolean; // Có hiển thị attributes hay không
  showOrderButton?: boolean; // Có hiển thị nút đặt hàng hay không
  className?: string;
  maxItems?: number;
}

/**
 * Component hiển thị grid sản phẩm
 * @param products - Danh sách sản phẩm
 * @param allProductsFromAPI - Tất cả sản phẩm từ API (để lấy attributes variants)
 * @param showAttributes - Có hiển thị attributes hay không
 * @param showOrderButton - Có hiển thị nút đặt hàng hay không
 * @param className - CSS class tùy chỉnh
 */
const ProductGrid = ({
  products,
  allProductsFromAPI = [],
  showAttributes = true,
  showOrderButton = false,
  className = "",
  maxItems,
}: ProductGridProps) => {
  // Nếu maxItems là số dương, giới hạn, ngược lại hiển thị toàn bộ
  const displayProducts =
    typeof maxItems === "number" && maxItems > 0
      ? products.slice(0, maxItems)
      : products;

  // Chỉ hiển thị nút nếu maxItems là số dương và products.length > maxItems
  const showSeeAll =
    typeof maxItems === "number" && maxItems > 0 && products.length > maxItems;

  return (
    <>
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}
      >
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            allProductsFromAPI={allProductsFromAPI}
            showAttributes={showAttributes}
          />
        ))}
      </div>
      {showSeeAll && (
        <div className="flex justify-center mt-6">
          <a
            href="/products"
            className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Xem tất cả sản phẩm
          </a>
        </div>
      )}
    </>
  );
};

export default ProductGrid;
