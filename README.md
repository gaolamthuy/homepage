# 🌾 Gạo Lâm Thúy - Homepage (Astro + React + Tailwind CSS)

Website bán gạo sạch, chất lượng cao, giao hàng tận nơi toàn quốc.  
Xây dựng với **Astro**, **React**, **Tailwind CSS**, hỗ trợ Light/Dark mode, UI hiện đại, tốc độ cao.

[![Astro](https://img.shields.io/badge/Astro-Framework-blueviolet)](https://astro.build/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Utility--First-38bdf8)](https://tailwindcss.com/)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

---

## 🚀 Tính năng nổi bật

- **Giao diện hiện đại**: Chuẩn UI/UX, tối ưu mobile, desktop.
- **Theme System**: Hỗ trợ Light/Dark mode chuyển đổi mượt mà.
- **Tích hợp API thực tế**: Dữ liệu sản phẩm lấy từ API động.
- **Tìm kiếm, filter, giỏ hàng**: Trải nghiệm mua sắm tiện lợi.
- **Performance**: Tối ưu tốc độ với Astro, lazy load, code splitting.
- **SEO Ready**: Chuẩn SEO, meta tag đầy đủ.

## 🛠️ Công nghệ sử dụng

- [Astro](https://astro.build/) (core)
- [React](https://react.dev/) (UI component)
- [Tailwind CSS](https://tailwindcss.com/) (styling)
- [shadcn/ui](https://ui.shadcn.com/) (UI kit)
- [Lucide React](https://lucide.dev/) (icon)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (form & validation)
- [PhotoSwipe](https://photoswipe.com/) (gallery)
- [Vitest](https://vitest.dev/) (test)

## 📦 Cài đặt & chạy local

```bash
git clone https://github.com/gaolamthuy/homepage.git
cd homepage
cp .env.example .env # Cấu hình API URL nếu cần
npm install
npm run dev
```

## 🌐 Cấu hình API

- Sửa file `.env`:
  ```
  PUBLIC_API_URL=[hidden]  # Liên hệ admin để lấy link
  ```
- Mọi fetch API đều tự động lấy bản mới nhất, không cache.

## 📁 Cấu trúc dự án

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── layouts/         # Astro layouts
│   ├── pages/           # Astro pages
│   ├── lib/             # Utilities, API
│   └── styles/          # Global styles
├── documents/           # Tài liệu hướng dẫn
├── package.json
└── tailwind.config.js
```

## 📚 Tài liệu nội bộ

- [Hướng dẫn theme](./documents/theme-guide.md)
- [API data update](./documents/api-data-update.md)
- [Master/Variant logic](./documents/master-variant-logic.md)
- [Product attributes display](./documents/product-attributes-display.md)
- [Components guide](./documents/components-guide.md)
- [Setup complete](./documents/setup-complete.md)
- [Remove shop features](./documents/remove-shop-features.md)
- [Variant selector](./documents/variant-selector.md)
- [Product page](./documents/product-page.md)
- [Simplified ProductCard](./documents/simplified-product-card.md)

## 📝 Đóng góp

1. Fork repo & tạo branch mới (`feature/your-feature`)
2. Commit & push code
3. Tạo Pull Request, mô tả rõ thay đổi

## 📄 License

MIT License

---

> Nếu dự án hữu ích, hãy ⭐ repo để ủng hộ team phát triển!
