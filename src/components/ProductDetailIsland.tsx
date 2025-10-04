import React, { useMemo, useState, useCallback } from "react";
import type { Product } from "../types/product"; // reuse central types

type ProductForIsland = Pick<
  Product,
  | "id"
  | "full_name"
  | "base_price"
  | "unit"
  | "order_template"
  | "child_product"
  | "child_unit"
>;

export interface ProductDetailIslandProps {
  product: ProductForIsland;
}

const formatVnd = (n: number | string) =>
  new Intl.NumberFormat("vi-VN").format(Number(n));

export default function ProductDetailIsland({
  product,
}: ProductDetailIslandProps) {
  const hasChild = Boolean(product.child_product);
  type VariantKey = "base" | "child";
  const [selected, setSelected] = useState<VariantKey>(
    hasChild ? "child" : "base"
  );

  const current = useMemo(() => {
    if (selected === "child" && product.child_product) {
      const cp = product.child_product;
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

  const onSelect = useCallback((v: VariantKey) => setSelected(v), []);

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
        // no outline  card
        <div className="mt-2 p-4 rounded-xl bg-base-100 shadow ">
          <h2 className="text-base font-bold mb-3">Lựa chọn biến thể</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onSelect("base")}
              className={`indicator border rounded-lg p-3 text-left hover:border-primary transition-colors w-full ${
                selected === "base" ? "border-primary" : ""
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
              className={`indicator border rounded-lg p-3 text-left hover:border-primary transition-colors w-full ${
                selected === "child" ? "border-primary" : ""
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
                  {product.child_product!.full_name}
                </div>
                {product.child_product?.order_template && (
                  <div className="text-xs text-base-content/60 line-clamp-1">
                    {product.child_product.order_template}
                  </div>
                )}
                <div className="text-xl font-extrabold text-primary">
                  {formatVnd(product.child_product!.base_price)}
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
