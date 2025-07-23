# Loại Bỏ Tính Năng Shop Và Tích Hợp Kiotviet

## Tổng Quan

Dự án đã được cập nhật để loại bỏ các tính năng shop (cart, checkout, order) và thay thế bằng việc link trực tiếp đến Kiotviet để xử lý đơn hàng.

## Thay Đổi Chính

### 1. Cập Nhật ProductCard Component

#### Bỏ Các Tính Năng Shop

- ❌ Bỏ `onAddToCart` callback
- ❌ Bỏ `onAddToWishlist` callback
- ❌ Bỏ button "Thêm vào giỏ"
- ❌ Bỏ button wishlist (Heart icon)

#### Thêm Link Kiotviet

- ✅ Thêm button "Đặt hàng" với icon ExternalLink
- ✅ Link trực tiếp đến trang sản phẩm trên Kiotviet
- ✅ Mở trong tab mới với `window.open()`

#### Code Thay Đổi

```typescript
// Trước
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  className?: string;
}

// Sau
interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
  className?: string;
}
```

### 2. Cập Nhật ProductGridWithFilter

#### Sử Dụng ProductCard Component

- ✅ Import và sử dụng ProductCard component
- ✅ Bỏ logic hiển thị sản phẩm thủ công
- ✅ Sử dụng grid layout responsive

#### Code Thay Đổi

```typescript
// Trước
<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  {filteredProducts.map((product: Product) => (
    <div key={product.id} className="...">
      {/* Hiển thị sản phẩm thủ công */}
    </div>
  ))}
</div>

// Sau
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {filteredProducts.map((product: Product) => (
    <ProductCard
      key={product.id}
      product={product}
      onProductClick={handleProductClick}
    />
  ))}
</div>
```

### 3. Cập Nhật Types

#### Bỏ Interfaces Không Cần Thiết

- ❌ `CartItem`
- ❌ `Cart`
- ❌ `Order`
- ❌ `OrderStatus`
- ❌ `Address`
- ❌ `PaymentMethod`
- ❌ `User`

#### Giữ Lại Interfaces Cần Thiết

- ✅ `Product`
- ✅ `ProductAttribute`
- ✅ `Category`
- ✅ `ProductFilter`
- ✅ `Pagination`
- ✅ `ApiResponse`

### 4. Tạo Config Kiotviet

#### File `src/lib/config.ts`

```typescript
export const KIOTVIET_CONFIG = {
  BASE_URL: "https://gaolamthuy.kiotviet.vn",
  PRODUCT_URL_PATTERN: "/san-pham/{slug}",
  CATEGORY_URL_PATTERN: "/danh-muc/{slug}",
};

export function getKiotvietProductUrl(product: any): string {
  const slug = product.glt?.glt_slug || product.code || product.id;
  return `${
    KIOTVIET_CONFIG.BASE_URL
  }${KIOTVIET_CONFIG.PRODUCT_URL_PATTERN.replace("{slug}", slug)}`;
}
```

## Lợi Ích Của Thay Đổi

### 1. Đơn Giản Hóa

- Bỏ logic phức tạp của cart, checkout
- Giảm codebase size
- Dễ maintain và debug

### 2. Tích Hợp Kiotviet

- Sử dụng hệ thống bán hàng đã có
- Không cần xây dựng lại tính năng đặt hàng
- Tận dụng các tính năng của Kiotviet

### 3. UX Tốt Hơn

- Chuyển hướng nhanh đến trang đặt hàng
- Không cần quản lý giỏ hàng phức tạp
- Trải nghiệm mua hàng trực tiếp

### 4. Performance

- Giảm bundle size
- Không cần state management cho cart
- Load trang nhanh hơn

## Cách Hoạt Động

### 1. Flow Đặt Hàng

```
User click "Đặt hàng"
→ Tạo URL Kiotviet
→ Mở tab mới
→ Chuyển đến trang sản phẩm Kiotviet
```

### 2. URL Generation

```typescript
// Ưu tiên sử dụng glt_slug
const slug = product.glt?.glt_slug || product.code || product.id;
const url = `https://gaolamthuy.kiotviet.vn/san-pham/${slug}`;
```

### 3. Security

```typescript
// Mở tab mới với noopener, noreferrer
window.open(url, "_blank", "noopener,noreferrer");
```

## Cấu Hình

### 1. Kiotviet URL

Có thể thay đổi trong `src/lib/config.ts`:

```typescript
export const KIOTVIET_CONFIG = {
  BASE_URL: "https://gaolamthuy.kiotviet.vn", // Thay đổi domain
  PRODUCT_URL_PATTERN: "/san-pham/{slug}", // Thay đổi pattern
};
```

### 2. App Configuration

```typescript
export const APP_CONFIG = {
  NAME: "Gạo Lâm Thúy",
  DESCRIPTION: "Gạo, Tấm, Nếp,...",
  SOCIAL: {
    facebook: "https://facebook.com/gaolamthuy",
    zalo: "https://zalo.me/gaolamthuy",
  },
};
```

## Tương Lai

### 1. Analytics

- Track click events đến Kiotviet
- Monitor conversion rate
- A/B test button text

### 2. SEO

- Meta tags cho sản phẩm
- Structured data
- Sitemap generation

### 3. Performance

- Lazy load images
- Preload critical resources
- Cache optimization

## Troubleshooting

### Lỗi Thường Gặp

1. **URL không đúng**

   - Kiểm tra `KIOTVIET_CONFIG.BASE_URL`
   - Kiểm tra `glt_slug` trong product data
   - Test URL pattern

2. **Tab không mở**

   - Kiểm tra popup blocker
   - Kiểm tra browser settings
   - Test với `window.open()`

3. **Product không tìm thấy trên Kiotviet**
   - Kiểm tra slug generation
   - Verify product exists on Kiotviet
   - Fallback to product ID

### Debug Commands

```typescript
// Test URL generation
console.log("Kiotviet URL:", getKiotvietProductUrl(product));

// Test config
console.log("Config:", KIOTVIET_CONFIG);

// Test product data
console.log("Product slug:", product.glt?.glt_slug);
```
