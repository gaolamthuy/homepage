# Gạo Lâm Thúy - Homepage Astro v3

Trang web hiển thị sản phẩm gạo của Gạo Lâm Thúy được xây dựng với Astro, Tailwind CSS, và daisyUI.

## 🚀 Tính năng

- **Hiển thị sản phẩm**: Lấy dữ liệu từ API và hiển thị danh sách sản phẩm
- **Responsive Design**: Giao diện tương thích với mọi thiết bị
- **Component-based**: Sử dụng Astro components để tái sử dụng code
- **Modern UI**: Sử dụng daisyUI với theme bumblebee tùy chỉnh
- **Font Nunito**: Typography đẹp mắt với font Nunito

## 🛠️ Công nghệ sử dụng

- **Astro 5.14.1**: Framework chính
- **Tailwind CSS 4.1.13**: Utility-first CSS framework
- **daisyUI 5.1.25**: Component library cho Tailwind CSS
- **TypeScript**: Type safety
- **Nunito Font**: Google Fonts

## 📁 Cấu trúc dự án

```
src/
├── assets/
│   └── app.css              # CSS chính với daisyUI config
├── components/
│   └── ProductCard.astro   # Component hiển thị sản phẩm
├── layouts/
│   └── Layout.astro        # Layout chính
└── pages/
    └── index.astro         # Trang chủ
```

## 🎨 Component ProductCard

Component `ProductCard` hiển thị thông tin sản phẩm với các tính năng:

- **Hình ảnh sản phẩm**: Hiển thị ảnh chính hoặc placeholder
- **Thông tin cơ bản**: Tên, giá, đơn vị, danh mục
- **Badge khuyến mãi**: Hiển thị khi sản phẩm có khuyến mãi
- **Badge variants**: Hiển thị khi sản phẩm có nhiều lựa chọn
- **Giá bao**: Hiển thị giá theo bao (nếu có)
- **Links**: Link đến shop chính thức và Shopee (nếu có)

## 🔧 Cấu hình

### Environment Variables

Tạo file `.env` với nội dung:

```env
PUBLIC_API_URL=https://cdn.gaolamthuy.vn/homepage
```

### daisyUI Theme

Sử dụng theme bumblebee tùy chỉnh với các màu sắc:

- **Primary**: Màu vàng chủ đạo
- **Secondary**: Màu xanh lá
- **Accent**: Màu xanh lá cây
- **Base**: Màu trắng và xám nhạt

## 🚀 Chạy dự án

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 📱 Responsive Design

- **Mobile**: 1 cột
- **Tablet**: 2 cột
- **Desktop**: 3 cột
- **Large Desktop**: 4 cột

## 🎯 API Integration

Dự án tích hợp với API `https://cdn.gaolamthuy.vn/homepage/products_data.json` để lấy dữ liệu sản phẩm.

### Cấu trúc dữ liệu sản phẩm:

```typescript
interface Product {
  id: number;
  name: string;
  full_name: string;
  base_price: number;
  unit: string;
  category_name: string;
  images: string[];
  glt_retail_promotion: boolean;
  has_variants: boolean;
  // ... và nhiều field khác
}
```

## 🎨 UI Components

Sử dụng các component daisyUI:

- **Card**: Hiển thị sản phẩm
- **Badge**: Hiển thị trạng thái
- **Button**: Các nút hành động
- **Hero**: Section hero
- **Stats**: Thống kê
- **Grid**: Layout responsive

## 📝 Ghi chú

- Tất cả code được comment bằng tiếng Việt
- Sử dụng TypeScript interfaces để type safety
- Responsive design với Tailwind CSS
- SEO-friendly với meta tags đầy đủ
