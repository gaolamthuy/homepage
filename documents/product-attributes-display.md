# Hiển Thị Attributes Sản Phẩm

## Tổng Quan

Dự án đã được cập nhật để hiển thị đầy đủ thông tin attributes của sản phẩm từ API, bao gồm các thuộc tính chi tiết và thông tin bổ sung.

## Cấu Trúc Attributes

### ProductAttribute Interface

```typescript
interface ProductAttribute {
  productId: number;
  attributeName: string;
  attributeValue: string;
}
```

### Ví Dụ Attributes Từ API

```json
{
  "attributes": [
    {
      "productId": 3065552,
      "attributeName": "MỨC ĐỘ MỚI",
      "attributeValue": "Tiêu chuẩn"
    }
  ]
}
```

## Thay Đổi Chính

### 1. Cập Nhật Product Type (`src/types/shop.ts`)

#### Thêm ProductAttribute Interface

- Định nghĩa cấu trúc cho từng attribute
- Bao gồm productId, attributeName, attributeValue

#### Mở Rộng Product Interface

- Thêm `attributes: ProductAttribute[]`
- Thêm các trường từ API: `fullName`, `code`, `unit`, etc.
- Thêm GLT custom fields: `glt_tags`, `glt_slug`, etc.

### 2. Cập Nhật Service (`src/lib/shop/mockData.ts`)

#### Lưu Trữ Đầy Đủ Attributes

```typescript
function mapApiDataToProduct(apiData: any): Product {
  return {
    // ... các trường cơ bản
    attributes: apiData.attributes || [], // Lưu trữ đầy đủ attributes
    fullName: apiData.fullName,
    code: apiData.code,
    unit: apiData.unit,
    glt: apiData.glt,
    // ... các trường khác
  };
}
```

### 3. Cập Nhật ProductCard Component (`src/components/shop/ProductCard.tsx`)

#### Hiển Thị Attributes

- Thêm section "Thông số" với icon Info
- Hiển thị từng attribute dạng key-value
- Sử dụng layout flex justify-between

#### Thông Tin Bổ Sung

- Mã sản phẩm (code)
- Đơn vị (unit)
- Trọng lượng (stockQuantity)
- GLT tags

#### Tên Đầy Đủ

- Hiển thị fullName nếu khác với name
- Giúp phân biệt các variant của cùng một sản phẩm

## Cách Hiển Thị

### 1. Attributes Section

```
📊 Thông số:
MỨC ĐỘ MỚI: Tiêu chuẩn
```

### 2. Thông Tin Bổ Sung

```
Mã: 2021101
Đơn vị: kg
Trọng lượng: 1000g
```

### 3. GLT Tags

```
[504-moi] [gạo-nở]
```

## Lợi Ích

### 1. Thông Tin Chi Tiết

- Khách hàng có thể xem đầy đủ thông số sản phẩm
- Phân biệt rõ các variant (Tiêu chuẩn, Lở, Mới tinh)
- Hiển thị mã sản phẩm để dễ tìm kiếm

### 2. Trải Nghiệm Người Dùng

- Thông tin rõ ràng, dễ đọc
- Layout responsive, tối ưu cho mobile
- Phân cấp thông tin hợp lý

### 3. Quản Lý Dữ Liệu

- Lưu trữ đầy đủ thông tin từ API
- Dễ dàng mở rộng thêm attributes mới
- Chuẩn bị cho trang product detail

## Test Và Kiểm Tra

### 1. Trang Test Attributes

Truy cập `/test-attributes` để xem:

- Thống kê số lượng sản phẩm có attributes
- Hiển thị ProductCard với attributes đầy đủ
- Chi tiết attributes của sản phẩm mẫu

### 2. Kiểm Tra Console

Mở Developer Tools để xem:

- Dữ liệu attributes được load
- Cấu trúc Product object

### 3. Responsive Design

Kiểm tra trên các thiết bị:

- Desktop: Hiển thị đầy đủ thông tin
- Tablet: Layout 2-3 cột
- Mobile: Layout 1 cột, text nhỏ gọn

## Tùy Chỉnh Hiển Thị

### 1. Thay Đổi Layout

```typescript
// Trong ProductCard.tsx
{
  product.attributes && product.attributes.length > 0 && (
    <div className="mb-3">{/* Tùy chỉnh style ở đây */}</div>
  );
}
```

### 2. Filter Attributes

```typescript
// Chỉ hiển thị một số attributes nhất định
{product.attributes
  .filter(attr => ['MỨC ĐỘ MỚI', 'LOẠI GẠO'].includes(attr.attributeName))
  .map((attr, index) => (
    // Render attribute
  ))}
```

### 3. Thêm Icons

```typescript
// Thêm icon cho từng loại attribute
const getAttributeIcon = (attributeName: string) => {
  switch (attributeName) {
    case "MỨC ĐỘ MỚI":
      return <Star className="h-3 w-3" />;
    case "LOẠI GẠO":
      return <Grain className="h-3 w-3" />;
    default:
      return <Info className="h-3 w-3" />;
  }
};
```

## Tương Lai

### 1. Trang Product Detail

- Hiển thị đầy đủ attributes
- So sánh các variant
- Gallery ảnh từ GLT fields

### 2. Filter Theo Attributes

- Filter theo "MỨC ĐỘ MỚI"
- Filter theo "LOẠI GẠO"
- Search trong attributes

### 3. SEO Optimization

- Meta tags từ attributes
- Structured data cho Google
- URL slug từ GLT fields

## Troubleshooting

### Lỗi Thường Gặp

1. **Attributes không hiển thị**

   - Kiểm tra `product.attributes` có tồn tại
   - Kiểm tra API response có attributes

2. **Layout bị vỡ**

   - Kiểm tra responsive classes
   - Test trên mobile device

3. **Performance chậm**
   - Lazy load attributes
   - Virtual scrolling cho danh sách dài

### Debug Commands

```bash
# Kiểm tra trang test
# Truy cập: http://localhost:4321/test-attributes

# Kiểm tra console
# Mở Developer Tools > Console
```
