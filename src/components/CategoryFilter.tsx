import React from "react";

/**
 * CategoryFilter - Button group filter ngang cho category
 * @param {Object[]} categories - Danh sách category {id, name}
 * @param {string} value - categoryId đang chọn ('' là tất cả)
 * @param {function} onChange - callback khi chọn category
 * Sử dụng: <CategoryFilter categories={...} value={...} onChange={...} />
 */
export default function CategoryFilter({
  categories,
  value,
  onChange,
}: {
  categories: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      <button
        type="button"
        className={`px-4 py-2 rounded-full font-medium border transition-colors text-sm
          ${
            value === ""
              ? "bg-amber-500 text-white border-amber-500"
              : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-amber-100 dark:hover:bg-slate-700"
          }`}
        onClick={() => onChange("")}
      >
        Tất cả
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`px-4 py-2 rounded-full font-medium border transition-colors text-sm
            ${
              value === cat.id
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-amber-100 dark:hover:bg-slate-700"
            }`}
          onClick={() => onChange(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
