# ProductCard Đơn Giản

## Tổng Quan

ProductCard đã được đơn giản hóa để chỉ hiển thị những thông tin cần thiết nhất: **tên sản phẩm**, **giá**, và **attributes**.

## Thông Tin Hiển Thị

### ✅ **Giữ Lại**

1. **Tên sản phẩm** (`product.name`)
2. **Giá** (`product.price`) - format theo VND
3. **Attributes** - hiển thị dạng key-value
4. **Hình ảnh sản phẩm**
5. **Button "Đặt hàng"** - link đến Kiotviet
6. **Badge "Hết hàng"** - khi `product.inStock = false`

### ❌ **Đã Loại Bỏ**

1. **Mô tả sản phẩm** (`product.description`)
2. **Tên đầy đủ** (`product.fullName`)
3. **Giá gốc** (`product.originalPrice`)
4. **Badge giảm giá**
5. **Đánh giá và số review** (`product.rating`, `product.reviewCount`)
6. **Tags** (`product.tags`)
7. **GLT tags** (`product.glt.glt_tags`)
8. **Thông tin bổ sung** (mã, đơn vị, trọng lượng)

## Cấu Trúc ProductCard

### Header

```typescript
<CardHeader>
  <img src={product.images[0]} alt={product.name} />
  {!product.inStock && <Badge>Hết hàng</Badge>}
</CardHeader>
```

### Content

```typescript
<CardContent>
  {/* Tên sản phẩm */}
  <h3>{product.name}</h3>

  {/* Giá */}
  <span>{formatPrice(product.price)}</span>

  {/* Attributes */}
  {attributeGroups.size > 0 && (
    <div>
      <span>Thông số:</span>
      {attributes.map((attr) => (
        <div key={attr.name}>
          <span>{attr.name}:</span>
          <span>{attr.values.join(", ")}</span>
        </div>
      ))}
    </div>
  )}
</CardContent>
```

### Footer

```typescript
<CardFooter>
  <Button onClick={handleOrderClick}>
    <ExternalLink />
    {product.inStock ? "Đặt hàng" : "Hết hàng"}
  </Button>
</CardFooter>
```

## Lợi Ích Của Thiết Kế Đơn Giản

### 1. **Tập Trung Vào Thông Tin Quan Trọng**

- Tên sản phẩm rõ ràng
- Giá hiển thị nổi bật
- Attributes giúp phân biệt các loại

### 2. **UX Tốt Hơn**

- Card gọn gàng, dễ đọc
- Không bị rối mắt bởi thông tin thừa
- Tập trung vào quyết định mua hàng

### 3. **Performance**

- Ít DOM elements
- Render nhanh hơn
- Bundle size nhỏ hơn

### 4. **Responsive Design**

- Card nhỏ gọn phù hợp mobile
- Layout linh hoạt
- Text không bị overflow

## Ví Dụ Hiển Thị

### Sản Phẩm Có Attributes

```
┌─────────────────┐
│   [Hình ảnh]    │
│                 │
│ 504             │
│ 16.500 ₫        │
│                 │
│ 📊 Thông số:    │
│ MỨC ĐỘ MỚI:     │
│ Tiêu chuẩn, Lở  │
│                 │
│ [Đặt hàng]      │
└─────────────────┘
```

### Sản Phẩm Không Có Attributes

```
┌─────────────────┐
│   [Hình ảnh]    │
│                 │
│ Gạo Huyết Rồng  │
│ 24.500 ₫        │
│                 │
│ [Đặt hàng]      │
└─────────────────┘
```

### Sản Phẩm Hết Hàng

```
┌─────────────────┐
│   [Hình ảnh]    │
│        [Hết hàng]│
│                 │
│ 5451            │
│ 19.000 ₫        │
│                 │
│ [Hết hàng]      │
└─────────────────┘
```

## Code Implementation

### Imports Đơn Giản

```typescript
import { ExternalLink, Info } from "lucide-react";
import { formatPrice, groupAttributesByName } from "@/lib/shop/utils";
import { getKiotvietProductUrl, openInNewTab } from "@/lib/config";
```

### Logic Xử Lý

```typescript
// Group attributes theo tên
const attributeGroups = groupAttributesByName(product.attributes || []);

// Handle click đặt hàng
const handleOrderClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  const kiotvietUrl = getKiotvietProductUrl(product);
  openInNewTab(kiotvietUrl);
};
```

## Tùy Chỉnh

### 1. **Thay Đổi Layout**

```typescript
// Thay đổi spacing
<h3 className="font-semibold text-lg mb-3"> // mb-3 thay vì mb-2

// Thay đổi màu sắc
<span className="text-lg font-bold text-primary"> // text-primary
```

### 2. **Thêm/Bớt Thông Tin**

```typescript
// Thêm mô tả ngắn
{
  product.description && (
    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
      {product.description}
    </p>
  );
}

// Thêm tags
{
  product.tags.length > 0 && (
    <div className="flex flex-wrap gap-1 mb-3">
      {product.tags.slice(0, 2).map((tag) => (
        <Badge key={tag} variant="outline" className="text-xs">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
```

### 3. **Thay Đổi Button Text**

```typescript
// Thay đổi text button
{product.inStock ? "Mua ngay" : "Hết hàng"}

// Thay đổi icon
<ExternalLink className="h-4 w-4 mr-2" />
// hoặc
<ShoppingCart className="h-4 w-4 mr-2" />
```

## Responsive Design

### Grid Layout

```typescript
// ProductGridWithFilter
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

### Card Sizing

- **Mobile**: 1 cột, card full width
- **Tablet**: 2 cột, card medium
- **Desktop**: 3-4 cột, card compact

## Performance Optimization

### 1. **Lazy Loading Images**

```typescript
<img
  src={product.images[0] || "/placeholder-product.jpg"}
  alt={product.name}
  loading="lazy"
  className="w-full h-full object-cover"
/>
```

### 2. **Memoization**

```typescript
// Có thể thêm React.memo nếu cần
export const ProductCard = React.memo(function ProductCard({ product, ... }) {
  // Component logic
});
```

### 3. **Conditional Rendering**

```typescript
// Chỉ render attributes khi có
{
  attributeGroups.size > 0 && (
    <div className="mb-3">{/* Attributes content */}</div>
  );
}
```

## Testing

### Test Cases

1. **Sản phẩm có attributes** - Hiển thị đầy đủ
2. **Sản phẩm không có attributes** - Chỉ hiển thị name + price
3. **Sản phẩm hết hàng** - Disable button, hiển thị badge
4. **Click đặt hàng** - Mở Kiotviet trong tab mới
5. **Responsive** - Layout đúng trên các thiết bị

### Debug

```typescript
// Kiểm tra attributes
console.log("Product attributes:", product.attributes);
console.log("Attribute groups:", attributeGroups);

// Kiểm tra URL Kiotviet
console.log("Kiotviet URL:", getKiotvietProductUrl(product));
```
