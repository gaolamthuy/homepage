# Product Page

## Tổng Quan

Product page được tạo để hiển thị chi tiết sản phẩm với đầy đủ thông tin và chức năng đặt hàng.

## Cấu Trúc URL

```
/product/{slug}
```

Trong đó `slug` được ưu tiên theo thứ tự:

1. `product.glt.glt_slug` (nếu có)
2. `product.code` (nếu có)
3. `product.id` (fallback)

## Tính Năng Chính

### 1. **Hiển Thị Thông Tin Sản Phẩm**

- Tên sản phẩm và tên đầy đủ
- Hình ảnh sản phẩm (gallery nếu có nhiều ảnh)
- Giá và giá gốc (nếu có giảm giá)
- Mô tả sản phẩm
- Attributes dạng badge
- Thông tin bổ sung (mã, đơn vị, trọng lượng)
- Tình trạng kho hàng

### 2. **Chức Năng Đặt Hàng**

- Button "Đặt hàng ngay" - link đến Kiotviet
- Button "Liên hệ tư vấn" - chuyển đến trang liên hệ
- Disable button khi hết hàng

### 3. **SEO Optimization**

- Meta title: `{product.name} - Gạo Lâm Thúy`
- Meta description: `{product.description}`
- Meta image: `{product.images[0]}`
- Breadcrumb navigation

### 4. **Image Gallery**

- Hình ảnh chính lớn
- Thumbnail gallery (nếu có nhiều ảnh)
- Click thumbnail để thay đổi ảnh chính

## Cấu Trúc Page

### Header

```astro
<!-- Breadcrumb -->
<nav class="mb-8">
  <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
    <li><a href="/">Trang chủ</a></li>
    <li>/</li>
    <li><a href="/#products">Sản phẩm</a></li>
    <li>/</li>
    <li>{product.name}</li>
  </ol>
</nav>
```

### Main Content

```astro
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <!-- Product Images -->
  <div class="space-y-4">
    <!-- Main image -->
    <!-- Thumbnail gallery -->
  </div>

  <!-- Product Info -->
  <div class="space-y-6">
    <!-- Product name -->
    <!-- Price -->
    <!-- Description -->
    <!-- Attributes -->
    <!-- Additional info -->
    <!-- Stock status -->
    <!-- Action buttons -->
    <!-- Tags -->
  </div>
</div>
```

### Related Products

```astro
<div class="mt-16">
  <h2 class="text-2xl font-bold mb-8">Sản phẩm liên quan</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Related products -->
  </div>
</div>
```

## Static Generation

### getStaticPaths

```typescript
export async function getStaticPaths() {
  const products = await getAllProducts();

  return products.map((product) => ({
    params: {
      slug: product.glt?.glt_slug || product.code || product.id,
    },
    props: { product },
  }));
}
```

### Props

```typescript
const { product } = Astro.props;
```

## JavaScript Functionality

### Order Button

```javascript
document.getElementById("orderButton")?.addEventListener("click", function () {
  const kiotvietUrl = `{kiotvietUrl}`;
  window.open(kiotvietUrl, "_blank", "noopener,noreferrer");
});
```

### Contact Button

```javascript
document
  .getElementById("contactButton")
  ?.addEventListener("click", function () {
    window.location.href = "/contact";
  });
```

### Image Gallery

```javascript
const mainImage = document.querySelector(".aspect-square img");
const thumbnails = document.querySelectorAll(".grid img");

thumbnails.forEach((thumb) => {
  thumb.addEventListener("click", function () {
    if (mainImage) {
      mainImage.src = this.src;
      mainImage.alt = this.alt;
    }
  });
});
```

## Navigation

### Từ ProductCard

```typescript
const handleProductClick = (product: Product) => {
  const slug = product.glt?.glt_slug || product.code || product.id;
  window.location.href = `/product/${slug}`;
};
```

### Breadcrumb

- Trang chủ → Sản phẩm → Tên sản phẩm
- Click vào "Sản phẩm" để quay lại danh sách

## Responsive Design

### Mobile (1 cột)

- Hình ảnh trên, thông tin dưới
- Button stack vertically
- Gallery 2x2 grid

### Tablet (2 cột)

- Hình ảnh trái, thông tin phải
- Button side by side
- Gallery 4 cột

### Desktop (2 cột)

- Layout tối ưu cho màn hình lớn
- Spacing rộng rãi
- Typography lớn hơn

## SEO Features

### Meta Tags

```astro
---
const title = `${product.name} - Gạo Lâm Thúy`;
const description = product.description || `Thông tin chi tiết về ${product.name}`;
const image = product.images[0] || "/placeholder-product.jpg";
---
```

### Structured Data

Có thể thêm JSON-LD schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "product.name",
  "description": "product.description",
  "image": "product.images",
  "offers": {
    "@type": "Offer",
    "price": "product.price",
    "priceCurrency": "VND",
    "availability": "product.inStock ? 'InStock' : 'OutOfStock'"
  }
}
```

## Performance Optimization

### 1. **Static Generation**

- Pre-build tất cả product pages
- Fast loading, SEO friendly

### 2. **Image Optimization**

- Lazy loading cho gallery
- Responsive images
- WebP format support

### 3. **Code Splitting**

- JavaScript chỉ load khi cần
- Minimal bundle size

## Future Enhancements

### 1. **Related Products**

- Hiển thị sản phẩm cùng category
- Sản phẩm có attributes tương tự
- Recently viewed products

### 2. **Reviews & Ratings**

- Hiển thị đánh giá từ Kiotviet
- Rating system
- Customer testimonials

### 3. **Social Sharing**

- Share buttons (Facebook, Zalo)
- Copy link functionality
- WhatsApp sharing

### 4. **Product Variants**

- Hiển thị các variants của sản phẩm
- So sánh attributes
- Quick switch between variants

## Troubleshooting

### Lỗi Thường Gặp

1. **404 Not Found**

   - Kiểm tra slug generation
   - Verify product exists
   - Check getStaticPaths logic

2. **Image không load**

   - Kiểm tra URL ảnh
   - Fallback to placeholder
   - Verify image format

3. **Button không hoạt động**
   - Kiểm tra JavaScript
   - Verify event listeners
   - Check console errors

### Debug Commands

```javascript
// Kiểm tra product data
console.log("Product:", product);

// Kiểm tra slug
console.log("Slug:", product.glt?.glt_slug || product.code || product.id);

// Kiểm tra Kiotviet URL
console.log("Kiotviet URL:", kiotvietUrl);
```
