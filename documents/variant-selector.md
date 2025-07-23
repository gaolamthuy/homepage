# Variant Selector

## Tổng Quan

Variant Selector là component cho phép người dùng chọn giữa các biến thể khác nhau của cùng một sản phẩm (ví dụ: gạo 5kg, 10kg, 25kg).

## Cấu Trúc Dữ Liệu

### Master Product vs Variants

```typescript
// Master Product (sản phẩm chính)
{
  id: "product-1",
  name: "Gạo Lâm Thúy",
  masterProductId: null, // null = master product
  // ... other fields
}

// Variants (các biến thể)
{
  id: "product-1-5kg",
  name: "Gạo Lâm Thúy 5kg",
  masterProductId: "product-1", // Link đến master
  price: 150000,
  // ... other fields
}
```

## Components

### 1. VariantSelector Component

**File:** `src/components/shop/VariantSelector.tsx`

**Props:**

```typescript
interface VariantSelectorProps {
  currentProduct: Product; // Sản phẩm hiện tại
  onVariantChange: (variant: Product) => void; // Callback khi chọn variant
  className?: string; // CSS class tùy chỉnh
}
```

**Tính năng:**

- Tự động load variants từ API
- Hiển thị loading state
- Error handling với retry button
- Responsive grid layout (2 cột)
- Hiển thị thông tin: tên, giá, attributes, stock status

### 2. ProductDetail Component

**File:** `src/components/shop/ProductDetail.tsx`

**Props:**

```typescript
interface ProductDetailProps {
  product: Product; // Sản phẩm ban đầu
  className?: string; // CSS class tùy chỉnh
}
```

**Tính năng:**

- Quản lý state của sản phẩm hiện tại
- Image gallery với thumbnail
- Variant selector integration
- URL update khi chọn variant
- Page title update

## API Endpoint

### GET /api/products

**File:** `src/pages/api/products.json.ts`

**Response:**

```json
[
  {
    "id": "product-1",
    "name": "Gạo Lâm Thúy",
    "masterProductId": null,
    "price": 150000,
    "attributes": [...],
    // ... other fields
  },
  {
    "id": "product-1-5kg",
    "name": "Gạo Lâm Thúy 5kg",
    "masterProductId": "product-1",
    "price": 150000,
    // ... other fields
  }
]
```

## Logic Tìm Variants

### 1. Nếu sản phẩm hiện tại là Master

```typescript
// Tìm tất cả variants có masterProductId = currentProduct.id
const variants = allProducts.filter(
  (product) => product.masterProductId === currentProduct.id
);
```

### 2. Nếu sản phẩm hiện tại là Variant

```typescript
// Tìm master và các variant khác cùng master
const variants = allProducts.filter(
  (product) =>
    product.id === currentProduct.masterProductId ||
    product.masterProductId === currentProduct.masterProductId
);
```

## UI/UX Features

### 1. **Loading State**

```tsx
<div className="p-3 border rounded-lg animate-pulse">
  <div className="h-4 bg-muted rounded mb-2"></div>
  <div className="h-3 bg-muted rounded w-2/3"></div>
</div>
```

### 2. **Error State**

```tsx
<div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
  <p className="text-sm text-destructive">
    Không thể tải danh sách loại sản phẩm: {error}
  </p>
  <button
    onClick={loadVariants}
    className="text-xs text-primary hover:underline"
  >
    Thử lại
  </button>
</div>
```

### 3. **Variant Option**

```tsx
<button
  className={`
  p-3 border rounded-lg text-left transition-all duration-200
  ${
    isSelected
      ? "border-primary bg-primary/5 text-primary shadow-sm"
      : "border-border hover:border-primary/50 hover:bg-muted/50"
  }
`}
>
  <div className="font-medium text-sm">{variant.name}</div>
  <div className="text-xs text-muted-foreground">
    {formatPrice(variant.price)}
  </div>
  {/* Attributes badges */}
  {/* Stock status */}
</button>
```

## State Management

### 1. **Product State**

```typescript
const [currentProduct, setCurrentProduct] = useState<Product>(product);
const [currentImageIndex, setCurrentImageIndex] = useState(0);
```

### 2. **Variant Change Handler**

```typescript
const handleVariantChange = (variant: Product) => {
  setCurrentProduct(variant);
  setCurrentImageIndex(0); // Reset về ảnh đầu tiên

  // Update URL without page reload
  const slug = variant.glt?.glt_slug || variant.code || variant.id;
  const newUrl = `/product/${slug}`;
  window.history.pushState({}, "", newUrl);

  // Update page title
  document.title = `${variant.fullName || variant.name} - Gạo Lâm Thúy`;
};
```

## URL Management

### 1. **Static Generation**

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

### 2. **Dynamic URL Update**

```typescript
// Khi chọn variant, update URL mà không reload page
const newUrl = `/product/${variantSlug}`;
window.history.pushState({}, "", newUrl);
```

## Responsive Design

### Mobile (1 cột)

- Variant options stack vertically
- Larger touch targets
- Simplified layout

### Tablet/Desktop (2 cột)

- Grid layout 2 cột
- Hover effects
- Detailed information display

## Performance Optimization

### 1. **API Caching**

```typescript
headers: {
  "Cache-Control": "public, max-age=300", // Cache 5 phút
}
```

### 2. **Conditional Rendering**

```typescript
// Chỉ hiển thị nếu có nhiều hơn 1 variant
if (variants.length <= 1) {
  return null;
}
```

### 3. **Lazy Loading**

- Variants chỉ load khi component mount
- Error boundary với retry mechanism

## Future Enhancements

### 1. **Advanced Filtering**

- Filter theo giá
- Filter theo attributes
- Sort options

### 2. **Quick Compare**

- So sánh nhanh giữa các variants
- Highlight differences
- Side-by-side view

### 3. **Stock Alerts**

- Notify khi variant hết hàng
- Suggest alternatives
- Back-in-stock notifications

### 4. **Price History**

- Hiển thị lịch sử giá
- Price trend indicators
- Best time to buy

## Troubleshooting

### Lỗi Thường Gặp

1. **Variants không load**

   ```javascript
   // Kiểm tra API endpoint
   console.log(
     "API Response:",
     await fetch("/api/products").then((r) => r.json())
   );

   // Kiểm tra masterProductId
   console.log("Current Product:", currentProduct);
   console.log("All Products:", allProducts);
   ```

2. **URL không update**

   ```javascript
   // Kiểm tra slug generation
   const slug = variant.glt?.glt_slug || variant.code || variant.id;
   console.log("Generated Slug:", slug);
   ```

3. **State không sync**
   ```javascript
   // Kiểm tra state updates
   console.log("Current Product State:", currentProduct);
   console.log("Selected Variant:", variant);
   ```

### Debug Commands

```javascript
// Kiểm tra variants
console.log("Variants:", variants);

// Kiểm tra API response
fetch("/api/products")
  .then((r) => r.json())
  .then(console.log);

// Kiểm tra URL update
console.log("Current URL:", window.location.href);
```
