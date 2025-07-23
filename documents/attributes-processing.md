# Xử Lý Attributes Từ Master Và Variants

## Tổng Quan

Dự án đã được cập nhật để xử lý attributes một cách thông minh, lấy tất cả attributes từ master product và các variants liên quan, sau đó group và unique để hiển thị đầy đủ thông tin.

## Logic Xử Lý Attributes

### 1. Lấy Sản Phẩm Liên Quan

```typescript
// Lấy master product và tất cả variants liên quan
const relatedProducts = allProducts.filter(
  (product) =>
    product.id === masterProductId ||
    product.masterProductId === masterProductId
);
```

**Giải thích:**

- `product.id === masterProductId`: Lấy master product
- `product.masterProductId === masterProductId`: Lấy tất cả variants của master product

### 2. Sử Dụng FlatMap

```typescript
// Sử dụng flatMap để lấy tất cả attributes
const allAttributes = relatedProducts.flatMap(
  (product) => product.attributes || []
);
```

**Lợi ích:**

- Lấy tất cả attributes từ nhiều sản phẩm
- Tự động flatten array
- Xử lý null/undefined an toàn

### 3. Group Và Unique

```typescript
// Group theo attributeName và lấy unique values
const attributeGroups = new Map<string, Set<string>>();

allAttributes.forEach((attr) => {
  const { attributeName, attributeValue } = attr;
  if (!attributeGroups.has(attributeName)) {
    attributeGroups.set(attributeName, new Set());
  }
  attributeGroups.get(attributeName)!.add(attributeValue);
});
```

**Kết quả:**

- Mỗi attributeName chỉ xuất hiện một lần
- Mỗi attributeValue chỉ xuất hiện một lần trong mỗi group
- Dễ dàng hiển thị dạng key-value

## Ví Dụ Thực Tế

### Dữ Liệu Gốc

```json
{
  "masterProduct": {
    "id": 3065552,
    "name": "504",
    "attributes": [
      { "attributeName": "MỨC ĐỘ MỚI", "attributeValue": "Tiêu chuẩn" }
    ]
  },
  "variants": [
    {
      "id": 3065553,
      "masterProductId": 3065552,
      "attributes": [{ "attributeName": "MỨC ĐỘ MỚI", "attributeValue": "Lở" }]
    }
  ]
}
```

### Kết Quả Sau Xử Lý

```typescript
{
  "attributes": [
    {"attributeName": "MỨC ĐỘ MỚI", "attributeValue": "Tiêu chuẩn"},
    {"attributeName": "MỨC ĐỘ MỚI", "attributeValue": "Lở"}
  ]
}
```

### Hiển Thị Trên Frontend

```
📊 Thông số:
MỨC ĐỘ MỚI: Tiêu chuẩn, Lở
```

## Utility Functions

### 1. Group Attributes Theo Tên

```typescript
export function groupAttributesByName(
  attributes: ProductAttribute[]
): Map<string, string[]> {
  const groups = new Map<string, string[]>();

  attributes.forEach((attr) => {
    const { attributeName, attributeValue } = attr;
    if (!groups.has(attributeName)) {
      groups.set(attributeName, []);
    }
    if (!groups.get(attributeName)!.includes(attributeValue)) {
      groups.get(attributeName)!.push(attributeValue);
    }
  });

  return groups;
}
```

### 2. Lấy Attribute Names

```typescript
export function getAttributeNames(product: Product): string[] {
  if (!product.attributes || product.attributes.length === 0) return [];
  return [...new Set(product.attributes.map((attr) => attr.attributeName))];
}
```

### 3. Lấy Attribute Values

```typescript
export function getAttributeValues(
  product: Product,
  attributeName: string
): string[] {
  if (!product.attributes || product.attributes.length === 0) return [];
  return product.attributes
    .filter((attr) => attr.attributeName === attributeName)
    .map((attr) => attr.attributeValue);
}
```

### 4. Filter Sản Phẩm Theo Attribute

```typescript
export function filterProductsByAttribute(
  products: Product[],
  attributeName: string,
  attributeValue: string
): Product[] {
  return products.filter((product) =>
    hasAttributeValue(product, attributeName, attributeValue)
  );
}
```

## Cách Sử Dụng Trong Component

### ProductCard Component

```typescript
import { groupAttributesByName } from "@/lib/shop/utils";

export function ProductCard({ product }: ProductCardProps) {
  // Group attributes theo tên để hiển thị gọn gàng hơn
  const attributeGroups = groupAttributesByName(product.attributes || []);

  return (
    <Card>
      {/* ... */}
      {attributeGroups.size > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1 mb-2">
            <Info className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              Thông số:
            </span>
          </div>
          <div className="space-y-1">
            {Array.from(attributeGroups.entries()).map(
              ([attributeName, values]) => (
                <div
                  key={attributeName}
                  className="flex justify-between text-xs"
                >
                  <span className="text-muted-foreground">
                    {attributeName}:
                  </span>
                  <span className="font-medium">{values.join(", ")}</span>
                </div>
              )
            )}
          </div>
        </div>
      )}
      {/* ... */}
    </Card>
  );
}
```

## Lợi Ích Của Cách Tiếp Cận Này

### 1. Dữ Liệu Đầy Đủ

- Hiển thị tất cả variants của một sản phẩm
- Không bỏ sót thông tin quan trọng
- Dễ dàng so sánh các loại

### 2. Hiệu Suất Tốt

- Sử dụng flatMap thay vì nested loops
- Group và unique ngay từ đầu
- Cache kết quả để tái sử dụng

### 3. Dễ Mở Rộng

- Thêm attributes mới dễ dàng
- Filter theo attributes
- Search trong attributes

### 4. UX Tốt

- Hiển thị thông tin gọn gàng
- Phân biệt rõ các loại
- Responsive design

## Test Và Debug

### 1. Trang Test Attributes V2

Truy cập `/test-attributes-v2` để xem:

- Thống kê attributes
- Loại attributes có sẵn
- Sản phẩm có nhiều attributes nhất

### 2. Console Log

```typescript
// Debug attributes của một sản phẩm
console.log("Product attributes:", product.attributes);
console.log(
  "Attribute groups:",
  groupAttributesByName(product.attributes || [])
);
```

### 3. Kiểm Tra Dữ Liệu

```typescript
// Kiểm tra số lượng attributes
console.log("Total attributes:", product.attributes?.length);
console.log("Unique attribute names:", getAttributeNames(product));
```

## Tương Lai

### 1. Filter Theo Attributes

- Dropdown filter theo "MỨC ĐỘ MỚI"
- Multi-select attributes
- Search trong attribute values

### 2. Trang Product Detail

- Hiển thị đầy đủ variants
- So sánh attributes
- Gallery theo attributes

### 3. SEO Optimization

- Meta tags từ attributes
- Structured data
- URL parameters

## Troubleshooting

### Lỗi Thường Gặp

1. **Attributes không hiển thị**

   - Kiểm tra `product.attributes` có tồn tại
   - Kiểm tra logic filter master/variants

2. **Duplicate attributes**

   - Kiểm tra logic unique trong groupAttributesByName
   - Kiểm tra dữ liệu API có duplicate không

3. **Performance chậm**
   - Cache kết quả groupAttributesByName
   - Lazy load attributes
   - Virtual scrolling

### Debug Commands

```bash
# Kiểm tra trang test
# Truy cập: http://localhost:4321/test-attributes-v2

# Kiểm tra console
# Mở Developer Tools > Console
```
