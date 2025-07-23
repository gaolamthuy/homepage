import React, { useState } from "react";
import ProductGrid from "./ProductGrid";
import type { Product, Category } from "@/types/shop";

interface ProductFilterGridProps {
  products: Product[];
  categories: Category[];
  allProductsFromAPI: any[];
  showAttributes?: boolean;
  showOrderButton?: boolean;
  maxItems?: number;
}

/**
 * Component filter + grid sản phẩm theo danh mục
 * @param products - Danh sách sản phẩm
 * @param categories - Danh sách danh mục
 * @param allProductsFromAPI - Dữ liệu sản phẩm từ API (để lấy attributes)
 * @param showAttributes - Hiển thị thuộc tính sản phẩm
 * @param showOrderButton - Hiển thị nút đặt hàng
 */
const ProductFilterGrid: React.FC<ProductFilterGridProps> = ({
  products,
  categories,
  allProductsFromAPI,
  showAttributes = true,
  showOrderButton = false,
  maxItems,
}) => {
  // State: category đang chọn (null = tất cả)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  // Lọc sản phẩm theo category
  const filteredProducts = selectedCategoryId
    ? products.filter(
        (p) =>
          p.category === selectedCategoryId ||
          p.categoryId?.toString() === selectedCategoryId
      )
    : products;

  return (
    <>
      {/* Filter tab scroll (shadcn style) */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div
            className="flex gap-1 overflow-x-auto whitespace-nowrap border-b border-border scrollbar-hide"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <button
              className={`px-3 py-2 text-sm border-b-2 transition-colors whitespace-nowrap font-semibold ${
                selectedCategoryId === null
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-primary hover:border-primary"
              }`}
              onClick={() => setSelectedCategoryId(null)}
              style={{ touchAction: "pan-x", minWidth: 'fit-content' }}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-3 py-2 text-sm border-b-2 transition-colors whitespace-nowrap font-semibold ${
                  selectedCategoryId === category.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-primary hover:border-primary"
                }`}
                onClick={() => setSelectedCategoryId(category.id)}
                style={{ touchAction: "pan-x", minWidth: 'fit-content' }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ProductGrid
            products={filteredProducts}
            allProductsFromAPI={allProductsFromAPI}
            showAttributes={showAttributes}
            showOrderButton={showOrderButton}
            maxItems={maxItems}
          />
        </div>
      </section>
    </>
  );
};

export default ProductFilterGrid;
