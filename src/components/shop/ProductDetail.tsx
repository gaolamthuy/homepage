/**
 * Component ProductDetail
 * Hiển thị chi tiết sản phẩm với variant selector
 *
 * Pure SPA Approach:
 * - Không thay đổi URL khi chọn variant
 * - Chỉ update state và content trên cùng 1 page
 * - UX mượt mà, không reload page
 * - Performance tốt hơn
 */

import React, { useState, useEffect } from "react";
import { formatPrice } from "../../lib/shop/utils";
import { Button } from "@/components/ui/button";
import { VariantSelector } from "./VariantSelector";
import type { Product } from "@/types/shop";

import { getKiotvietProductUrl, openInNewTab } from "@/lib/config";

interface ProductDetailProps {
  product: Product;
  className?: string;
}

/**
 * Component hiển thị chi tiết sản phẩm
 * @param product - Thông tin sản phẩm
 * @param className - CSS class tùy chỉnh
 */
const ProductDetail = ({ product, className = "" }: ProductDetailProps) => {
  const [currentProduct, setCurrentProduct] = useState<Product>(product);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isChangingVariant, setIsChangingVariant] = useState(false);

  // Sync currentProduct với prop product khi prop thay đổi
  useEffect(() => {
    setCurrentProduct(product);
    setCurrentImageIndex(0);
  }, [product.id]);

  const handleVariantChange = (variant: Product) => {
    setIsChangingVariant(true);

    // Simulate small delay để user thấy có thay đổi
    setTimeout(() => {
      setCurrentProduct(variant);
      setCurrentImageIndex(0); // Reset về ảnh đầu tiên
      setIsChangingVariant(false);

      // Pure SPA approach - không thay đổi URL
      // Chỉ update content trên cùng 1 page
      // window.history.pushState({}, "", newUrl); // Đã xóa

      // Update page title để user biết đang xem variant nào
      document.title = `${variant.fullName || variant.name} - Gạo Lâm Thúy`;
    }, 150);
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleOrderClick = () => {
    const kiotvietUrl =
      currentProduct.glt?.glt_kiotvietshop_url ||
      getKiotvietProductUrl(currentProduct);
    openInNewTab(kiotvietUrl);
  };

  const handleContactClick = () => {
    window.open("https://zalo.me/0901467300", "_blank");
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${className}`}>
      {/* Product Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={
              currentProduct.images[currentImageIndex] ||
              "/placeholder-product.jpg"
            }
            alt={currentProduct.fullName || currentProduct.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnail Gallery */}
        {currentProduct.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {currentProduct.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-md"
              >
                <img
                  src={image}
                  alt={`${
                    currentProduct.fullName || currentProduct.name
                  } - Ảnh ${index + 1}`}
                  className={`
                    w-full h-full object-cover cursor-pointer transition-opacity
                    ${
                      currentImageIndex === index
                        ? "opacity-100 ring-2 ring-primary"
                        : "opacity-75 hover:opacity-100"
                    }
                  `}
                  onClick={() => handleImageClick(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div
        className={`space-y-6 transition-opacity duration-200 ${
          isChangingVariant ? "opacity-50" : "opacity-100"
        }`}
      >
        {/* Product Name */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1 transition-all duration-300">
            {currentProduct.name}
          </h1>
          {currentProduct.fullName &&
            currentProduct.fullName !== currentProduct.name && (
              <p className="text-lg text-muted-foreground transition-all duration-300">
                {currentProduct.fullName}
              </p>
            )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-primary transition-all duration-300">
            {formatPrice(currentProduct.price)}
          </span>
          {currentProduct.originalPrice &&
            currentProduct.originalPrice > currentProduct.price && (
              <span className="text-lg text-muted-foreground line-through transition-all duration-300">
                {formatPrice(currentProduct.originalPrice)}
              </span>
            )}
        </div>

        {/* Description */}
        {currentProduct.description && (
          <div className="transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
            <p className="text-muted-foreground leading-relaxed">
              {currentProduct.description}
            </p>
          </div>
        )}

        {/* Variant Selector */}
        <VariantSelector
          currentProduct={currentProduct}
          onVariantChange={handleVariantChange}
          isChangingVariant={isChangingVariant}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            onClick={handleOrderClick}
            disabled={!currentProduct.allowsSale}
            className="flex-1 flex flex-col items-center justify-center py-5 min-h-[64px] text-lg"
            size="lg"
          >
            <span className="flex items-center justify-center gap-2 text-xl font-bold">
              {/* Icon open in new tab */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H19.5M19.5 6V12M19.5 6L10.5 15M4.5 19.5H19.5V4.5"
                />
              </svg>
              {currentProduct.allowsSale ? "Đặt hàng ngay" : "Hết hàng"}
              <br />
              <span className="text-sm text-muted-foreground mt-1 font-normal">
                qua KiotvietWeb
              </span>
            </span>
          </Button>

          <Button
            onClick={handleContactClick}
            variant="secondary"
            className="flex-1 flex flex-col items-center justify-center py-5 min-h-[64px] text-lg"
            size="lg"
          >
            <span className="flex items-center justify-center gap-2 text-xl font-bold">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
                alt="Zalo"
                className="w-7 h-7"
              />
              Liên hệ Zalo
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;
