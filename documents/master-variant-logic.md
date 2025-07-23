# Master/Variant Logic

## Tổng Quan

Logic master/variant được xây dựng dựa trên dữ liệu thực tế từ API [gaolamthuy.vn](https://cdn.gaolamthuy.vn/homepage/data.json).

## Cấu Trúc Dữ Liệu

### 1. **Master Product (Sản phẩm chính)**

```json
{
  "id": "3065552",
  "name": "504",
  "fullName": "504 - Tiêu chuẩn (kg)",
  "hasVariants": true,
  "masterProductId": null,
  "allowsSale": true,
  "price": 16500,
  "attributes": [
    {
      "attributeName": "MỨC ĐỘ MỚI",
      "attributeValue": "Tiêu chuẩn"
    },
    {
      "attributeName": "MỨC ĐỘ MỚI",
      "attributeValue": "Lở"
    }
  ]
}
```

### 2. **Variant Product (Biến thể)**

```json
{
  "id": "3065553",
  "name": "504",
  "fullName": "504 - Lở (kg)",
  "hasVariants": true,
  "masterProductId": 3065552,
  "allowsSale": true,
  "price": 15000,
  "attributes": [
    {
      "attributeName": "MỨC ĐỘ MỚI",
      "attributeValue": "Lở"
    }
  ]
}
```

### 3. **Standalone Product (Sản phẩm độc lập)**

```json
{
  "id": "3749577",
  "name": "Thơm Lài Sữa 49",
  "fullName": "Thơm Lài Sữa 49 (kg)",
  "hasVariants": false,
  "masterProductId": null,
  "allowsSale": true,
  "price": 25000
}
```

## Logic Phân Loại

### **Quy Tắc 1: Master Product**

```typescript
// Điều kiện: hasVariants = true AND masterProductId = null/undefined
if (product.hasVariants === true && !product.masterProductId) {
  // Đây là master product
  // Tìm tất cả variants có masterProductId = product.id
}
```

### **Quy Tắc 2: Variant Product**

```typescript
// Điều kiện: hasVariants = true AND masterProductId = [number]
if (product.hasVariants === true && product.masterProductId) {
  // Đây là variant product
  // Tìm master và các variant khác cùng master
}
```

### **Quy Tắc 3: Standalone Product**

```typescript
// Điều kiện: hasVariants = false
if (product.hasVariants === false) {
  // Đây là sản phẩm độc lập, không có variants
  // Không hiển thị variant selector
}
```

## Implementation

### **VariantSelector Component**

```typescript
const loadVariants = async () => {
  const allProducts: Product[] = await response.json();
  let productVariants: Product[] = [];

  if (currentProduct.hasVariants === false) {
    // Sản phẩm độc lập, không có variants
    productVariants = [];
  } else if (
    currentProduct.hasVariants === true &&
    !currentProduct.masterProductId
  ) {
    // Master product - tìm tất cả variants
    productVariants = allProducts.filter(
      (product) => product.masterProductId === parseInt(currentProduct.id)
    );
    // Thêm master product vào danh sách
    productVariants.unshift(currentProduct);
  } else if (
    currentProduct.hasVariants === true &&
    currentProduct.masterProductId
  ) {
    // Variant product - tìm master và các variant khác
    const masterProduct = allProducts.find(
      (p) => p.id === currentProduct.masterProductId?.toString()
    );
    const otherVariants = allProducts.filter(
      (product) => product.masterProductId === currentProduct.masterProductId
    );

    if (masterProduct) {
      productVariants = [masterProduct, ...otherVariants];
    } else {
      productVariants = otherVariants;
    }
  }

  setVariants(productVariants);
};
```

## Type Safety

### **Product Interface**

```typescript
export interface Product {
  id: string; // ID sản phẩm (string)
  name: string; // Tên ngắn
  fullName?: string; // Tên đầy đủ
  hasVariants?: boolean; // Có variants hay không
  masterProductId?: number | null; // ID master product (number)
  allowsSale?: boolean; // Có thể bán (thay cho inStock)
  price: number; // Giá
  attributes: ProductAttribute[]; // Thuộc tính
  // ... other fields
}
```

### **Type Conversion**

```typescript
// String to Number conversion cho masterProductId
product.masterProductId === parseInt(currentProduct.id);

// Number to String conversion cho id
p.id === currentProduct.masterProductId?.toString();
```

## Ví Dụ Thực Tế

### **Gạo 504 Series**

```
Master: 504 - Tiêu chuẩn (kg)
├── ID: 3065552
├── hasVariants: true
├── masterProductId: null
└── Price: 16,500₫

Variants:
├── 504 - Lở (kg)
│   ├── ID: 3065553
│   ├── hasVariants: true
│   ├── masterProductId: 3065552
│   └── Price: 15,000₫
└── 504 - Nở (kg)
    ├── ID: 3065554
    ├── hasVariants: true
    ├── masterProductId: 3065552
    └── Price: 17,000₫
```

### **Gạo Thơm Lài Sữa 49**

```
Standalone: Thơm Lài Sữa 49 (kg)
├── ID: 3749577
├── hasVariants: false
├── masterProductId: null
└── Price: 25,000₫
```

## UI/UX Features

### **Variant Display**

- **Master Badge**: Hiển thị badge "Master" cho master product
- **Price Comparison**: So sánh giá giữa các variants
- **Attribute Badges**: Hiển thị thuộc tính khác biệt
- **Stock Status**: Hiển thị trạng thái `allowsSale`

### **Navigation**

- **URL Update**: Cập nhật URL khi chọn variant
- **Page Title**: Thay đổi title theo variant
- **Breadcrumb**: Cập nhật breadcrumb
- **Image Gallery**: Thay đổi ảnh theo variant

## Error Handling

### **API Errors**

```typescript
if (error) {
  return (
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
  );
}
```

### **No Variants**

```typescript
// Không hiển thị nếu chỉ có 1 variant hoặc không có variants
if (variants.length <= 1) {
  return null;
}
```

## Performance Optimization

### **Caching**

```typescript
headers: {
  "Cache-Control": "public, max-age=300", // Cache 5 phút
}
```

### **Conditional Rendering**

- Chỉ load variants khi cần thiết
- Skeleton loading cho UX tốt hơn
- Error boundary với retry mechanism

## Future Enhancements

### **Advanced Filtering**

- Filter theo giá range
- Filter theo attributes
- Sort options (price, name, popularity)

### **Variant Comparison**

- Side-by-side comparison
- Highlight differences
- Quick switch between variants

### **Stock Management**

- Real-time stock updates
- Back-in-stock notifications
- Alternative suggestions
