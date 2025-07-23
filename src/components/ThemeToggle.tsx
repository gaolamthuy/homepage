import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Component chuyển đổi theme light/dark
 *
 * Tính năng:
 * - Chuyển đổi giữa light mode (amber) và dark mode (slate)
 * - Lưu trạng thái vào localStorage
 * - Tự động phát hiện theme hệ thống ban đầu
 * - Icon thay đổi theo theme hiện tại
 *
 * Sử dụng: <ThemeToggle />
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Chỉ render sau khi component đã mount để tránh hydration mismatch
  useEffect(() => {
    setMounted(true);

    // Lấy theme từ localStorage hoặc hệ thống
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      setIsDark(systemTheme);
    }
  }, []);

  // Cập nhật theme khi state thay đổi
  useEffect(() => {
    if (!mounted) return;

    // Lưu vào localStorage
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // Thêm/xóa class dark vào html element
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark, mounted]);

  // Không render gì cho đến khi component mount xong
  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-slate-700 hover:bg-amber-200 dark:hover:bg-slate-600 flex items-center justify-center transition-all duration-200 group"
      aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      title={isDark ? "Chế độ sáng" : "Chế độ tối"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-500 group-hover:text-amber-600 transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600 group-hover:text-slate-700 transition-colors" />
      )}
    </button>
  );
}
