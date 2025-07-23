# Hướng dẫn sử dụng Theme Light/Dark

## Tổng quan

Dự án Shop Online hỗ trợ 2 chế độ theme:

- **Light Mode**: Sử dụng màu chủ đạo Amber (vàng cam)
- **Dark Mode**: Sử dụng màu chủ đạo Slate (xám đen)

## Cấu hình Theme

### 1. File cấu hình Tailwind (`tailwind.config.mjs`)

```javascript
export default {
  darkMode: "class", // Kích hoạt dark mode bằng class
  theme: {
    extend: {
      colors: {
        // Light theme colors (amber-based)
        primary: {
          DEFAULT: "#f59e0b", // amber-500
          // ... các cấp độ màu khác
        },
        // Dark theme colors (slate-based)
        dark: {
          DEFAULT: "#334155", // slate-700
          // ... các cấp độ màu khác
        },
      },
    },
  },
};
```

### 2. Component ThemeToggle

Component `ThemeToggle` được tạo để chuyển đổi theme:

```tsx
import ThemeToggle from "@/components/ThemeToggle";

// Sử dụng trong layout
<ThemeToggle client:load />;
```

**Tính năng:**

- Chuyển đổi giữa light/dark mode
- Lưu trạng thái vào localStorage
- Tự động phát hiện theme hệ thống
- Icon thay đổi theo theme hiện tại

## Cách sử dụng trong code

### 1. Background colors

```html
<!-- Light: trắng, Dark: slate-900 -->
<div class="bg-white dark:bg-slate-900">
  <!-- Light: gray-50, Dark: slate-800 -->
  <div class="bg-gray-50 dark:bg-slate-800"></div>
</div>
```

### 2. Text colors

```html
<!-- Heading -->
<h1 class="text-gray-900 dark:text-white">
  <!-- Body text -->
  <p class="text-gray-600 dark:text-slate-400">
    <!-- Primary text -->
    <span class="text-amber-600 dark:text-amber-400"></span>
  </p>
</h1>
```

### 3. Border colors

```html
<!-- Light: gray-200, Dark: slate-700 -->
<div class="border border-gray-200 dark:border-slate-700"></div>
```

### 4. Button colors

```html
<!-- Primary button -->
<button
  class="bg-amber-500 dark:bg-slate-600 text-white hover:bg-amber-600 dark:hover:bg-slate-700"
></button>
```

### 5. Input fields

```html
<input
  class="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
/>
```

## Bảng màu tham khảo

### Light Mode (Amber)

- **Primary**: `amber-500` (#f59e0b)
- **Background**: `white` (#ffffff)
- **Secondary Background**: `gray-50` (#f9fafb)
- **Text**: `gray-900` (#111827)
- **Secondary Text**: `gray-600` (#4b5563)
- **Border**: `gray-200` (#e5e7eb)

### Dark Mode (Slate)

- **Primary**: `slate-600` (#475569)
- **Background**: `slate-900` (#0f172a)
- **Secondary Background**: `slate-800` (#1e293b)
- **Text**: `white` (#ffffff)
- **Secondary Text**: `slate-400` (#94a3b8)
- **Border**: `slate-700` (#334155)

## Best Practices

### 1. Luôn sử dụng cặp class light/dark

```html
<!-- ✅ Đúng -->
<div class="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
  <!-- ❌ Sai - chỉ có light mode -->
  <div class="bg-white text-gray-900"></div>
</div>
```

### 2. Sử dụng transition cho smooth animation

```html
<div class="bg-white dark:bg-slate-900 transition-colors duration-200"></div>
```

### 3. Test trên cả 2 mode

- Kiểm tra contrast ratio
- Đảm bảo text dễ đọc
- Test trên mobile và desktop

### 4. Sử dụng semantic colors

```html
<!-- Thay vì hardcode màu, sử dụng semantic -->
<div class="bg-primary dark:bg-dark text-primary-foreground"></div>
```

## Mở rộng Theme

### Thêm theme mới

1. Thêm màu vào `tailwind.config.mjs`:

```javascript
colors: {
  // Theme mới
  purple: {
    DEFAULT: '#8b5cf6',
    // ...
  }
}
```

2. Cập nhật component ThemeToggle để hỗ trợ theme mới

3. Cập nhật tất cả components sử dụng màu mới

### Thêm system theme detection

```javascript
// Tự động theo theme hệ thống
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
systemTheme.addEventListener("change", (e) => {
  // Xử lý khi user thay đổi theme hệ thống
});
```

## Troubleshooting

### 1. Hydration mismatch

- Sử dụng `mounted` state trong React components
- Tránh render khác nhau giữa server và client

### 2. Flash of unstyled content (FOUC)

- Thêm script inline để set theme trước khi render
- Sử dụng `suppressHydrationWarning` nếu cần

### 3. Performance

- Sử dụng CSS variables cho dynamic colors
- Tránh thay đổi theme quá thường xuyên

## Tài liệu tham khảo

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [CSS Color Scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
