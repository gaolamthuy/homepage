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

  const handleShopeeClick = () => {
    const shopeeUrl = currentProduct.glt?.glt_shopee_url;
    if (shopeeUrl) {
      window.open(shopeeUrl, "_blank", "noopener,noreferrer");
    }
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
        <div className="space-y-3">
          {/* Main Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary transition-all duration-300">
              {formatPrice(currentProduct.price)}/{currentProduct.unit || "kg"}
            </span>
            {currentProduct.originalPrice &&
              currentProduct.originalPrice > currentProduct.price && (
                <span className="text-lg text-muted-foreground line-through transition-all duration-300">
                  {formatPrice(currentProduct.originalPrice)}
                </span>
              )}
          </div>

          {/* Units Pricing - Simple text format */}
          {currentProduct.units && currentProduct.units.length > 0 && (
            <div className="space-y-1">
              {currentProduct.units.map((unit) => (
                <div key={unit.id} className="text-sm text-muted-foreground">
                  {formatPrice(unit.basePrice)}/{unit.unit}
                </div>
              ))}
            </div>
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
        <div className="space-y-4 pt-4">
          {/* Main Order Button */}
          <Button
            onClick={handleOrderClick}
            disabled={!currentProduct.allowsSale}
            className="w-full flex flex-col items-center justify-center py-5 min-h-[64px] text-lg"
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

          {/* Contact Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-4">
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

            <Button
              onClick={handleShopeeClick}
              disabled={!currentProduct.glt?.glt_shopee_url}
              variant="outline"
              className="flex-1 flex flex-col items-center justify-center py-5 min-h-[64px] text-lg"
              size="lg"
            >
              <span className="flex items-center justify-center gap-2 text-xl font-bold">
                {/* Shopee Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="28"
                  height="28"
                  className="text-[#f4511e]"
                >
                  <path fill="#f4511e" d="M36.683,43H11.317c-2.136,0-3.896-1.679-3.996-3.813l-1.272-27.14C6.022,11.477,6.477,11,7.048,11 h33.904c0.571,0,1.026,0.477,0.999,1.047l-1.272,27.14C40.579,41.321,38.819,43,36.683,43z"/>
                  <path fill="#f4511e" d="M32.5,11.5h-2C30.5,7.364,27.584,4,24,4s-6.5,3.364-6.5,7.5h-2C15.5,6.262,19.313,2,24,2 S32.5,6.262,32.5,11.5z"/>
                  <path fill="#fafafa" d="M24.248,25.688c-2.741-1.002-4.405-1.743-4.405-3.577c0-1.851,1.776-3.195,4.224-3.195 c1.685,0,3.159,0.66,3.888,1.052c0.124,0.067,0.474,0.277,0.672,0.41l0.13,0.087l0.958-1.558l-0.157-0.103 c-0.772-0.521-2.854-1.733-5.49-1.733c-3.459,0-6.067,2.166-6.067,5.039c0,3.257,2.983,4.347,5.615,5.309 c3.07,1.122,4.934,1.975,4.934,4.349c0,1.828-2.067,3.314-4.609,3.314c-2.864,0-5.326-2.105-5.349-2.125l-0.128-0.118l-1.046,1.542 l0.106,0.087c0.712,0.577,3.276,2.458,6.416,2.458c3.619,0,6.454-2.266,6.454-5.158C30.393,27.933,27.128,26.741,24.248,25.688z"/>
                </svg>
                {currentProduct.glt?.glt_shopee_url ? "Đặt hàng Shopee" : "Đang phát triển"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;
