import React, { useMemo, useState, useCallback, useEffect } from "react";
import type { Product } from "../types/product"; // reuse central types
import { getFallbackImages } from "../lib/shared-images";

type ProductForIsland = Pick<
  Product,
  | "id"
  | "full_name"
  | "base_price"
  | "unit"
  | "order_template"
  | "child_product"
  | "child_unit"
  | "glt_images"
> & {
  child_product?: Product["child_product"];
};

export interface ProductDetailIslandProps {
  product: ProductForIsland;
}

const formatVnd = (n: number | string) =>
  new Intl.NumberFormat("vi-VN").format(Number(n));

export default function ProductDetailIsland({
  product,
}: ProductDetailIslandProps) {
  // Sử dụng useMemo để tránh re-compute không cần thiết
  const hasChild = useMemo(() => {
    return Boolean(product.child_product && product.child_product.length > 0);
  }, [product.child_product]);

  type VariantKey = "base" | "child";

  // Khởi tạo state ổn định hơn
  const [selected, setSelected] = useState<VariantKey>(() => {
    // Tính toán trực tiếp trong initializer
    const hasChildProducts = Boolean(
      product.child_product && product.child_product.length > 0
    );
    return hasChildProducts ? "child" : "base";
  });

  // State cho shared images (fallback)
  const [sharedImages, setSharedImages] = useState<
    Array<{ url: string; role: string }>
  >([]);

  // State để track ảnh hiện tại đang hiển thị
  const [currentImageSource, setCurrentImageSource] = useState<
    "product" | "shared" | null
  >(null);
  const [currentSharedImageUrl, setCurrentSharedImageUrl] = useState<
    string | null
  >(null);

  // Đảm bảo state được sync với props - chỉ chạy khi hasChild thay đổi
  useEffect(() => {
    if (hasChild && selected === "base") {
      setSelected("child");
    } else if (!hasChild && selected === "child") {
      setSelected("base");
    }
  }, [hasChild]); // Chỉ depend vào hasChild, không depend vào selected

  // Fetch shared images khi component mount
  useEffect(() => {
    const loadSharedImages = async () => {
      try {
        const fallbackImages = await getFallbackImages();
        setSharedImages(fallbackImages);
      } catch (error) {
        console.warn("Failed to load shared images:", error);
      }
    };

    loadSharedImages();
  }, []);

  /**
   * Hàm lấy URL hình ảnh cho variant được chọn
   * Ưu tiên: main image từ glt_images, fallback: shared images
   */
  const getImageForVariant = useCallback(
    (variant: VariantKey) => {
      let images;

      if (
        variant === "child" &&
        product.child_product &&
        product.child_product.length > 0
      ) {
        images = product.child_product[0].glt_images;
      } else {
        images = product.glt_images;
      }

      // Ưu tiên ảnh từ product trước
      if (images && images.length > 0) {
        // Tìm ảnh main
        const mainImage = images.find((img: any) => img.role === "main");
        if (mainImage) {
          return mainImage.url;
        }

        // Fallback: lấy ảnh đầu tiên từ product
        return images[0].url;
      }

      // Fallback: sử dụng shared images
      if (sharedImages.length > 0) {
        // Ưu tiên ảnh main từ shared images
        const sharedMain = sharedImages.find((img) =>
          img.role.includes("shared-main")
        );
        if (sharedMain) {
          return sharedMain.url;
        }

        // Fallback: lấy ảnh đầu tiên từ shared images
        return sharedImages[0].url;
      }

      return null;
    },
    [product, sharedImages]
  );

  /**
   * Cập nhật hình ảnh chính khi variant thay đổi
   * Có error handling và cleanup
   */
  useEffect(() => {
    const updateImage = () => {
      // Nếu đang xem shared image, không thay đổi
      if (currentImageSource === "shared" && currentSharedImageUrl) {
        return;
      }

      const imageUrl = getImageForVariant(selected);
      if (!imageUrl) return;

      const mainImage = document.getElementById(
        "main-product-image"
      ) as HTMLImageElement;
      if (!mainImage) {
        // Retry sau 100ms nếu element chưa render
        setTimeout(updateImage, 100);
        return;
      }

      // Preload image để tránh broken image
      const img = new Image();
      img.onload = () => {
        mainImage.src = imageUrl;
        mainImage.alt =
          selected === "child" &&
          product.child_product &&
          product.child_product.length > 0
            ? product.child_product[0].full_name
            : product.full_name;

        // Reset về product image khi variant thay đổi
        setCurrentImageSource("product");
        setCurrentSharedImageUrl(null);
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${imageUrl}`);
      };
      img.src = imageUrl;
    };

    // Debounce để tránh update quá nhiều lần
    const timeoutId = setTimeout(updateImage, 50);
    return () => clearTimeout(timeoutId);
  }, [selected, getImageForVariant, currentImageSource, currentSharedImageUrl]);

  const current = useMemo(() => {
    if (
      selected === "child" &&
      product.child_product &&
      product.child_product.length > 0
    ) {
      const cp = product.child_product[0];
      return {
        full_name: cp.full_name,
        base_price: cp.base_price,
        unit: cp.unit,
        order_template: cp.order_template || product.order_template,
        childUnit: cp.child_unit
          ? {
              base_price: cp.child_unit.base_price,
              unit: cp.child_unit.unit,
              full_name: cp.child_unit.full_name,
              conversion_value: cp.child_unit.conversion_value,
              base_price_per_masterunit:
                cp.child_unit.base_price_per_masterunit,
            }
          : undefined,
      };
    }
    return {
      full_name: product.full_name,
      base_price: product.base_price,
      unit: product.unit,
      order_template: product.order_template,
      childUnit: product.child_unit
        ? {
            base_price: product.child_unit.base_price,
            unit: product.child_unit.unit,
            full_name: product.child_unit.full_name,
            conversion_value: product.child_unit.conversion_value,
            base_price_per_masterunit:
              product.child_unit.base_price_per_masterunit,
          }
        : undefined,
    };
  }, [selected, product]);

  const onSelect = useCallback((v: VariantKey) => {
    setSelected(v);
  }, []);

  /**
   * Smart image switching: click shared image → hiển thị shared, click lại → về product image
   */
  const handleSharedImageClick = useCallback(
    (imageUrl: string) => {
      const mainImage = document.getElementById(
        "main-product-image"
      ) as HTMLImageElement;
      if (!mainImage) return;

      // Nếu đang xem shared image và click cùng ảnh → về product image
      if (
        currentImageSource === "shared" &&
        currentSharedImageUrl === imageUrl
      ) {
        const productImageUrl = getImageForVariant(selected);
        if (productImageUrl) {
          mainImage.src = productImageUrl;
          mainImage.alt =
            selected === "child" &&
            product.child_product &&
            product.child_product.length > 0
              ? product.child_product[0].full_name
              : product.full_name;
          setCurrentImageSource("product");
          setCurrentSharedImageUrl(null);
        }
      } else {
        // Hiển thị shared image
        mainImage.src = imageUrl;
        mainImage.alt = `Shared image`;
        setCurrentImageSource("shared");
        setCurrentSharedImageUrl(imageUrl);
      }
    },
    [
      currentImageSource,
      currentSharedImageUrl,
      selected,
      getImageForVariant,
      product,
    ]
  );

  return (
    <section className="space-y-4">
      <div className="text-md font-semibold text-base-content/70">
        {current.full_name} • {current.order_template}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-primary">
          {formatVnd(current.base_price)}
        </span>
        <span className="text-sm text-base-content/70">/{current.unit}</span>
      </div>

      {current.childUnit && (
        <div className="mt-2 p-3 bg-base-200 rounded-lg">
          <div className="text-sm font-semibold text-base-content/80 mb-1">
            {current.childUnit.full_name}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-primary">
              {formatVnd(current.childUnit.base_price)}
            </span>
            <span className="text-base-content/70">
              /{current.childUnit.unit}
            </span>
            <span className="text-xs text-base-content/60">
              (Quy đổi: {formatVnd(current.childUnit.base_price_per_masterunit)}
              /kg)
            </span>
          </div>
        </div>
      )}

      {hasChild && (
        // Variant selector - chỉ hiển thị khi có child_product
        <div className="mt-2 p-4 rounded-xl bg-base-100 shadow">
          <h2 className="text-base font-bold mb-3">Lựa chọn biến thể</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onSelect("base")}
              className={`indicator border rounded-lg p-3 text-left hover:border-primary transition-all duration-300 w-full ${
                selected === "base"
                  ? "border-primary bg-primary/5"
                  : "hover:bg-base-200"
              }`}
              aria-pressed={selected === "base"}
            >
              {selected === "base" && (
                <span className="indicator-item indicator-top indicator-end badge badge-primary badge-sm -translate-y-2 translate-x-2">
                  Đang chọn
                </span>
              )}
              <div className="space-y-1">
                <div className="text-base font-semibold line-clamp-1">
                  {product.full_name}
                </div>
                {product.order_template && (
                  <div className="text-xs text-base-content/60 line-clamp-1">
                    {product.order_template}
                  </div>
                )}
                <div className="text-xl font-extrabold text-primary">
                  {formatVnd(product.base_price)}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelect("child")}
              className={`indicator border rounded-lg p-3 text-left hover:border-primary transition-all duration-300 w-full ${
                selected === "child"
                  ? "border-primary bg-primary/5"
                  : "hover:bg-base-200"
              }`}
              aria-pressed={selected === "child"}
            >
              {selected === "child" && (
                <span className="indicator-item indicator-top indicator-end badge badge-primary badge-sm -translate-y-2 translate-x-2">
                  Đang chọn
                </span>
              )}
              <div className="space-y-1">
                <div className="text-base font-semibold line-clamp-1">
                  {product.child_product![0].full_name}
                </div>
                {product.child_product?.[0]?.order_template && (
                  <div className="text-xs text-base-content/60 line-clamp-1">
                    {product.child_product[0].order_template}
                  </div>
                )}
                <div className="text-xl font-extrabold text-primary">
                  {formatVnd(product.child_product![0].base_price)}
                </div>
              </div>
            </button>
          </div>

          {/* Thông báo hình ảnh sẽ thay đổi */}
          <div className="mt-3 text-xs text-base-content/60 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3 h-3"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            Hình ảnh sẽ cập nhật theo lựa chọn
          </div>
        </div>
      )}

      {/* Shared Images Gallery - chỉ hiển thị khi có ít ảnh product */}
      {sharedImages.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-base-100 shadow">
          <h3 className="text-sm font-semibold mb-3 text-base-content/80">
            Hình ảnh bổ sung
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sharedImages.slice(0, 6).map((img, index) => {
              const isActive =
                currentImageSource === "shared" &&
                currentSharedImageUrl === img.url;

              return (
                <div
                  key={`${img.url}-${index}`}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 ${
                    isActive ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleSharedImageClick(img.url)}
                >
                  <img
                    src={img.url}
                    alt={`Shared image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />

                  {/* Icon check khi đang xem shared image */}
                  {isActive && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-content rounded-full flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-base-content/60">
            {currentImageSource === "shared"
              ? "Click lại để về ảnh gốc"
              : "Click vào ảnh để xem chi tiết"}
          </div>
        </div>
      )}
    </section>
  );
}
