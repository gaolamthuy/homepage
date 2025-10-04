import React, { useCallback, useEffect, useMemo, useState } from "react";

interface CategoryLike {
  category_name: string;
  homepage_item_count?: number | null;
}

export interface ProductsFilterIslandProps {
  categories: CategoryLike[];
  productsContainerId?: string;
}

/**
 * Component React điều khiển bộ lọc sản phẩm bằng checkbox + nút reset (daisyUI)
 * - Quản lý state chọn nhiều category
 * - Áp dụng filter lên DOM SSR (grid sản phẩm do Astro render sẵn)
 *
 * Lý do áp dụng lên DOM thay vì re-render toàn bộ card trong React:
 * - Tránh trùng lặp UI logic với `ProductCard.astro`
 * - Giữ SSR nhanh của Astro, chỉ hydrate một island nhỏ cho filter
 *
 * @param products Danh sách sản phẩm (để tham chiếu nhanh category)
 * @param categories Danh sách category hiển thị filter
 * @param productsContainerId Id của container chứa các phần tử `.product-item`
 * @returns JSX điều khiển UI filter
 */
export default function ProductsFilterIsland({
  categories,
  productsContainerId = "products-container",
}: ProductsFilterIslandProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const categoryKeys = useMemo(
    () => categories.map((c) => c.category_name),
    [categories]
  );

  const onToggle = useCallback((cat: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const onReset = useCallback(() => setSelected(new Set()), []);

  useEffect(() => {
    const container = document.getElementById(productsContainerId);
    if (!container) return;

    const productItems =
      container.querySelectorAll<HTMLElement>(".product-item");

    const active = Array.from(selected);
    const showAll = active.length === 0;

    productItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category-filter");
      const shouldShow =
        showAll || (itemCategory ? selected.has(itemCategory) : false);
      item.style.display = shouldShow ? "block" : "none";
    });
  }, [selected, productsContainerId]);

  return (
    <div className="mb-8">
      <form className="filter flex flex-wrap gap-1 items-center">
        <input
          className="btn btn-square btn-md"
          type="reset"
          value="×"
          aria-label="Xóa bộ lọc"
          title="Hiển thị tất cả sản phẩm"
          onClick={(e) => {
            e.preventDefault();
            onReset();
          }}
        />

        {categoryKeys.map((category) => {
          const checked = selected.has(category);
          return (
            <label
              key={category}
              className={`btn btn-md relative cursor-pointer indicator ${
                checked ? "btn-active btn-primary text-primary-content" : ""
              }`}
              aria-pressed={checked}
            >
              <input
                className="sr-only"
                type="checkbox"
                name="category_filter"
                aria-label={category}
                data-category={category}
                checked={checked}
                onChange={() => onToggle(category)}
              />
              <span className="flex items-center gap-2">
                {category}
                <span className="badge badge-sm badge-outline">
                  {categories.find((c) => c.category_name === category)
                    ?.homepage_item_count ?? 0}
                </span>
              </span>
            </label>
          );
        })}
      </form>
    </div>
  );
}
