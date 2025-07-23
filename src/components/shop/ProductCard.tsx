import React from "react";
import type { Product } from "@/types/shop";
import {
  groupAttributesByName,
  getAllAttributesForMaster,
} from "../../lib/shop/utils";

interface ProductCardProps {
  product: Product;
  allProductsFromAPI?: any[];
  showAttributes?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  allProductsFromAPI = [],
  showAttributes = true,
}) => {
  let attributeGroups;
  if (
    showAttributes &&
    allProductsFromAPI.length > 0 &&
    product.hasVariants &&
    !product.masterProductId
  ) {
    // Master product: lấy attributes của master + variants
    const allAttributes = getAllAttributesForMaster(
      parseInt(product.id),
      allProductsFromAPI
    );
    attributeGroups = groupAttributesByName(allAttributes);
  } else if (showAttributes) {
    attributeGroups = groupAttributesByName(product.attributes || []);
  }

  return (
    <a
      href={`/product/${product.glt?.glt_slug || product.code || product.id}`}
      className="group block bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0] || "/placeholder-product.jpg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Badge hết hàng */}
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-medium">
            Hết hàng
          </div>
        )}
        {/* Category Badge */}
        <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm text-foreground px-2 py-1 rounded text-xs font-medium">
          {product.category}
        </div>
      </div>
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          </span>
        </div>
        {/* Attributes - Hiển thị tùy theo showAttributes */}
        {showAttributes && attributeGroups && attributeGroups.size > 0 && (
          <div className="space-y-2">
            {Array.from(attributeGroups.entries()).map(
              ([attributeName, values]) => (
                <div
                  key={attributeName}
                  className="border-b border-border pb-2 last:border-b-0"
                >
                  <div className="font-medium text-xs text-muted-foreground mb-1">
                    {attributeName}:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {values.map((value: string, index: number) => (
                      <span
                        key={`${attributeName}-${index}`}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </a>
  );
};

export default ProductCard;
