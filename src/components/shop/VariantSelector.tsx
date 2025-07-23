/**
 * Component VariantSelector
 * Hiển thị danh sách các variant của sản phẩm và cho phép chọn
 */

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/shop";
import { formatPrice } from "../../lib/shop/utils";

interface VariantSelectorProps {
  currentProduct: Product;
  onVariantChange: (variant: Product) => void;
  isChangingVariant?: boolean;
  className?: string;
}

/**
 * Component hiển thị selector cho các variant sản phẩm
 * @param currentProduct - Sản phẩm hiện tại đang xem
 * @param onVariantChange - Callback khi chọn variant khác
 * @param className - CSS class tùy chỉnh
 */
export function VariantSelector({
  currentProduct,
  onVariantChange,
  isChangingVariant,
  className = "",
}: VariantSelectorProps) {
  const [variants, setVariants] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load variants từ API
  useEffect(() => {
    loadVariants();
  }, [currentProduct.id]);

  const loadVariants = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dữ liệu từ API endpoint được cấu hình trong .env
      const apiUrl = import.meta.env.PUBLIC_API_URL + (import.meta.env.PUBLIC_API_URL.includes('?') ? '&' : '?') + 't=' + Date.now();
      
      const response = await fetch(apiUrl, { 
        cache: 'no-store',
        headers: {
          'User-Agent': 'Gaolamthuy-Homepage/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API fetch failed: ${response.status} ${response.statusText}`);
      }

      let apiData: any;
      try {
        const text = await response.text();
        apiData = JSON.parse(text);
      } catch (jsonErr) {
        setError("Dữ liệu sản phẩm không hợp lệ hoặc API trả về rỗng");
        setVariants([]);
        setLoading(false);
        return;
      }

      // Parse structure: data[0].products từ API response
      const allProducts = apiData[0]?.products || [];

      if (!Array.isArray(allProducts) || allProducts.length === 0) {
        setVariants([]);
        setLoading(false);
        return;
      }

      // Logic tìm variants dựa trên hasVariants và masterProductId
      let productVariants: any[] = [];

      if (currentProduct.hasVariants === false) {
        // Sản phẩm độc lập, không có variants
        productVariants = [];
      } else if (
        currentProduct.hasVariants === true &&
        !currentProduct.masterProductId
      ) {
        // Master product - tìm tất cả variants có masterProductId = currentProduct.id
        productVariants = allProducts.filter(
          (product: any) => product.masterProductId === parseInt(currentProduct.id)
        );
        // Thêm master product vào danh sách
        const masterFromAPI = allProducts.find((p: any) => p.id === parseInt(currentProduct.id));
        if (masterFromAPI) {
          productVariants.unshift(masterFromAPI);
        }
      } else if (
        currentProduct.hasVariants === true &&
        currentProduct.masterProductId
      ) {
        // Variant product - tìm master và các variant khác cùng master
        const masterProduct = allProducts.find(
          (p: any) => p.id === currentProduct.masterProductId
        );
        const otherVariants = allProducts.filter(
          (product: any) =>
            product.masterProductId === currentProduct.masterProductId
        );

        if (masterProduct) {
          productVariants = [masterProduct, ...otherVariants];
        } else {
          productVariants = otherVariants;
        }
      }

      // Convert API data to Product format
      const mappedVariants = productVariants.map((apiProduct: any) => ({
        id: String(apiProduct.id),
        name: apiProduct.name || apiProduct.fullName || "Sản phẩm không tên",
        fullName: apiProduct.fullName,
        description: apiProduct.description || "Không có mô tả",
        price: apiProduct.basePrice || 0,
        images: apiProduct.images || [],
        category: apiProduct.categoryName || "Khác",
        tags: (apiProduct.attributes || []).map((attr: any) => attr.attributeValue),
        inStock: apiProduct.allowsSale && apiProduct.isActive,
        stockQuantity: apiProduct.weight || 0,
        rating: 5,
        reviewCount: 0,
        createdAt: new Date(apiProduct.createdDate || Date.now()),
        updatedAt: new Date(apiProduct.modifiedDate || Date.now()),
        attributes: apiProduct.attributes || [],
        code: apiProduct.code,
        categoryId: apiProduct.categoryId,
        allowsSale: apiProduct.allowsSale,
        hasVariants: apiProduct.hasVariants,
        unit: apiProduct.unit,
        isActive: apiProduct.isActive,
        masterProductId: apiProduct.masterProductId,
        glt: apiProduct.glt,
      }));

      setVariants(mappedVariants);
    } catch (err) {
      console.error("Error loading variants:", err);
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
      setVariants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVariantSelect = (variant: Product) => {
    if (variant.id !== currentProduct.id) {
      onVariantChange(variant);
    }
  };

  // Hiển thị loading state
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold">Chọn loại</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 border rounded-lg animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
          <div className="p-3 border rounded-lg animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold">Chọn loại</h3>
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
          <p className="text-sm text-destructive">
            Không thể tải danh sách loại sản phẩm: {error}
          </p>
          <button
            onClick={loadVariants}
            className="mt-2 text-xs text-primary hover:underline"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Không hiển thị nếu chỉ có 1 variant hoặc không có variants
  if (variants.length <= 1) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Chọn loại</h3>
        {isChangingVariant && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Đang chuyển...</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {variants.map((variant) => {
          const isSelected = variant.id === currentProduct.id;
          const isMaster =
            variant.hasVariants === true && !variant.masterProductId;

          return (
            <button
              key={variant.id}
              onClick={() => handleVariantSelect(variant)}
              className={`
                p-3 border rounded-lg text-left transition-all duration-300 ease-in-out
                transform hover:scale-[1.02] active:scale-[0.98]
                ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary shadow-md ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50 hover:bg-muted/50 hover:shadow-sm"
                }
              `}
            >
              {/* Tên variant */}
              <div className="font-medium text-sm mb-1 flex items-center gap-2">
                <span>{variant.fullName || variant.name}</span>
                {isSelected && (
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                )}
              </div>

              {/* Variant description */}
              <div className="text-xs text-muted-foreground mb-2">
                {variant.description}
              </div>

              {/* Giá */}
              <div className="text-xs text-muted-foreground mb-2">
                {formatPrice(variant.price)}
              </div>

              {/* Attributes (hiển thị tối đa 2 cái đầu tiên) */}
              {variant.attributes && variant.attributes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {variant.attributes.slice(0, 2).map((attr, index) => (
                    <Badge
                      key={`${attr.attributeName}-${index}`}
                      variant="secondary"
                      className="text-xs px-1.5 py-0.5"
                    >
                      {attr.attributeValue}
                    </Badge>
                  ))}
                  {variant.attributes.length > 2 && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      +{variant.attributes.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
