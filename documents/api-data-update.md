# Cập Nhật Dữ Liệu API Mới

## Tổng Quan

Dự án đã được cập nhật để sử dụng API mới từ `[hidden]` với cấu trúc dữ liệu được tối ưu hóa.

## Cấu Trúc API Mới

### Endpoint

```
[hidden]  # Liên hệ admin để lấy link API
```

### Cấu Trúc Dữ Liệu

API trả về một array chứa 2 phần tử:

1. **Item 1**: Chứa danh sách sản phẩm

   ```json
   {
     "products": [
       {
         "id": 3065552,
         "name": "504",
         "fullName": "504 - Tiêu chuẩn (kg)",
         "categoryId": 132086,
         "categoryName": "Gạo nở",
         "basePrice": 16500,
         "masterProductId": null, // null = master product
         "isActive": true,
         "allowsSale": true
         // ... các trường khác
       }
     ]
   }
   ```

2. **Item 2**: Chứa danh sách danh mục
   ```json
   {
     "product_categories": [
       {
         "categoryId": 132086,
         "categoryName": "Gạo nở",
         "glt": {
           "glt_is_active": true,
           "glt_color_border": "#ff914d"
         }
       }
     ]
   }
   ```

## Thay Đổi Chính

### 1. Cập Nhật Service (`src/lib/shop/mockData.ts`)

#### Lấy Sản Phẩm

- **Trước**: `data[0]?.products?.data`
- **Sau**: `data[0]?.products`

#### Lấy Danh Mục

- **Trước**: `data[0]?.caterogies?.json?.data`
- **Sau**: `data[1]?.product_categories`

#### Filter Danh Mục

- Thêm filter `glt_is_active = true` để chỉ lấy những danh mục đang hoạt động
- Loại bỏ các danh mục không cần thiết như "Quà khuyến mãi", "Dịch vụ", "test"

### 2. Cập Nhật Environment Variables (`.env`)

```env
PUBLIC_API_URL=[hidden]  # Liên hệ admin để lấy link
```

### 3. Filter Master Products

- Chỉ hiển thị master products (sản phẩm chính)
- Loại bỏ variants (sản phẩm con) bằng cách filter `masterProductId = null/undefined`

## Danh Mục Đang Hoạt Động

Theo API mới, các danh mục đang hoạt động (`glt_is_active = true`) bao gồm:

1. **Gạo nở** (ID: 132086) - Màu: #ff914d
2. **Gạo dẻo** (ID: 133275) - Màu: #ff886e
3. **Gạo chính hãng** (ID: 133392) - Màu: #fff86e
4. **Tấm** (ID: 133393) - Màu: #caff6e
5. **Nếp** (ID: 133394) - Màu: #6eff7d
6. **Lúa - Gạo Lứt** (ID: 178627) - Màu: #6effe0

## Kiểm Tra Và Test

### 1. Script Test API

Chạy script test để kiểm tra API:

```bash
node test-api.js
```

### 2. Trang Test Data

Truy cập `/test-data` để xem dữ liệu thực tế được load.

### 3. Kiểm Tra Console

Mở Developer Tools để xem log khi load dữ liệu.

## Lợi Ích Của Cập Nhật

1. **Hiệu Suất Tốt Hơn**: API mới được tối ưu hóa
2. **Dữ Liệu Sạch Hơn**: Chỉ hiển thị master products và active categories
3. **Quản Lý Dễ Dàng**: Filter tự động loại bỏ dữ liệu không cần thiết
4. **Chuẩn Bị Cho Product Detail**: Master products sẵn sàng cho việc hiển thị variants

## Troubleshooting

### Lỗi Thường Gặp

1. **API không response**

   - Kiểm tra kết nối internet
   - Kiểm tra URL trong `.env` (liên hệ admin để lấy link)

2. **Không có dữ liệu hiển thị**

   - Kiểm tra console log
   - Chạy script test để debug

3. **Categories không load**
   - Kiểm tra filter `glt_is_active`
   - Kiểm tra cấu trúc `data[1]?.product_categories`

### Debug Commands

```bash
# Test API trực tiếp
node test-api.js

# Chạy dev server
npm run dev

# Kiểm tra trang test
# Truy cập: http://localhost:4321/test-data
```

## Tương Lai

- Chuẩn bị cho việc tạo trang product detail
- Hiển thị variants của từng master product
- Tối ưu hóa performance với caching
- Thêm tính năng search và filter nâng cao
