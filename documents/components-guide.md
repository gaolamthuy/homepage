# Hướng dẫn sử dụng Components

## ProductCard Component

### Mô tả

Component hiển thị thông tin sản phẩm dạng card với đầy đủ thông tin và các action buttons.

### Props

| Prop              | Type                         | Required | Default | Mô tả                           |
| ----------------- | ---------------------------- | -------- | ------- | ------------------------------- |
| `product`         | `Product`                    | ✅       | -       | Thông tin sản phẩm              |
| `onAddToCart`     | `(product: Product) => void` | ❌       | -       | Callback khi thêm vào giỏ hàng  |
| `onAddToWishlist` | `(product: Product) => void` | ❌       | -       | Callback khi thêm vào wishlist  |
| `onProductClick`  | `(product: Product) => void` | ❌       | -       | Callback khi click vào sản phẩm |
| `className`       | `string`                     | ❌       | `''`    | CSS class tùy chỉnh             |

### Ví dụ sử dụng

```tsx
import { ProductCard } from '@/components/shop/ProductCard';

// Cơ bản
<ProductCard product={product} />

// Với tất cả callbacks
<ProductCard
  product={product}
  onAddToCart={(product) => {
    console.log('Thêm vào giỏ hàng:', product.name);
    addToCart(product);
  }}
  onAddToWishlist={(product) => {
    console.log('Thêm vào wishlist:', product.name);
    addToWishlist(product);
  }}
  onProductClick={(product) => {
    console.log('Click sản phẩm:', product.name);
    navigateToProduct(product.id);
  }}
  className="custom-card-class"
/>
```

### Features

- ✅ Hiển thị hình ảnh sản phẩm
- ✅ Badge giảm giá (nếu có)
- ✅ Badge hết hàng (nếu hết hàng)
- ✅ Tên và mô tả sản phẩm
- ✅ Đánh giá và số lượng review
- ✅ Giá hiện tại và giá gốc (nếu giảm giá)
- ✅ Tags sản phẩm
- ✅ Button thêm vào giỏ hàng
- ✅ Button wishlist (hover)
- ✅ Responsive design
- ✅ Hover effects

---

## ProductGrid Component

### Mô tả

Component hiển thị danh sách sản phẩm dạng grid với responsive layout.

### Props

| Prop              | Type                         | Required | Default | Mô tả                           |
| ----------------- | ---------------------------- | -------- | ------- | ------------------------------- |
| `products`        | `Product[]`                  | ✅       | -       | Danh sách sản phẩm              |
| `columns`         | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | ❌       | `4`     | Số cột hiển thị                 |
| `onAddToCart`     | `(product: Product) => void` | ❌       | -       | Callback khi thêm vào giỏ hàng  |
| `onAddToWishlist` | `(product: Product) => void` | ❌       | -       | Callback khi thêm vào wishlist  |
| `onProductClick`  | `(product: Product) => void` | ❌       | -       | Callback khi click vào sản phẩm |
| `className`       | `string`                     | ❌       | `''`    | CSS class tùy chỉnh             |

### Ví dụ sử dụng

```tsx
import { ProductGrid } from '@/components/shop/ProductGrid';

// Cơ bản
<ProductGrid products={products} />

// Với 3 cột và callbacks
<ProductGrid
  products={products}
  columns={3}
  onAddToCart={handleAddToCart}
  onAddToWishlist={handleAddToWishlist}
  onProductClick={handleProductClick}
  className="my-custom-grid"
/>
```

### Responsive Breakpoints

- **Mobile**: 1 cột
- **Small (sm)**: 2 cột
- **Large (lg)**: 3 cột
- **Extra Large (xl)**: 4 cột
- **2XL**: 5-6 cột (tùy theo prop columns)

---

## Cart Component

### Mô tả

Component hiển thị giỏ hàng với đầy đủ chức năng quản lý sản phẩm.

### Props

| Prop               | Type                                            | Required | Default | Mô tả                         |
| ------------------ | ----------------------------------------------- | -------- | ------- | ----------------------------- |
| `cart`             | `Cart`                                          | ✅       | -       | Thông tin giỏ hàng            |
| `onUpdateQuantity` | `(productId: string, quantity: number) => void` | ✅       | -       | Callback cập nhật số lượng    |
| `onRemoveItem`     | `(productId: string) => void`                   | ✅       | -       | Callback xóa sản phẩm         |
| `onClearCart`      | `() => void`                                    | ✅       | -       | Callback xóa toàn bộ giỏ hàng |
| `onCheckout`       | `() => void`                                    | ✅       | -       | Callback thanh toán           |
| `className`        | `string`                                        | ❌       | `''`    | CSS class tùy chỉnh           |

### Ví dụ sử dụng

```tsx
import { Cart } from "@/components/shop/Cart";

<Cart
  cart={cart}
  onUpdateQuantity={(productId, quantity) => {
    console.log("Cập nhật số lượng:", productId, quantity);
    updateCartItemQuantity(productId, quantity);
  }}
  onRemoveItem={(productId) => {
    console.log("Xóa sản phẩm:", productId);
    removeFromCart(productId);
  }}
  onClearCart={() => {
    console.log("Xóa toàn bộ giỏ hàng");
    clearCart();
  }}
  onCheckout={() => {
    console.log("Chuyển đến trang thanh toán");
    navigateToCheckout();
  }}
  className="my-cart-component"
/>;
```

### Features

- ✅ Hiển thị danh sách sản phẩm trong giỏ hàng
- ✅ Điều chỉnh số lượng sản phẩm
- ✅ Xóa từng sản phẩm
- ✅ Xóa toàn bộ giỏ hàng
- ✅ Tính toán tự động: tạm tính, phí ship, thuế, tổng cộng
- ✅ Button thanh toán
- ✅ Hiển thị trạng thái giỏ hàng trống
- ✅ Responsive design

---

## useCart Hook

### Mô tả

Custom hook quản lý state giỏ hàng với localStorage persistence.

### Returns

| Property          | Type                                            | Mô tả                               |
| ----------------- | ----------------------------------------------- | ----------------------------------- |
| `cart`            | `Cart`                                          | Thông tin giỏ hàng hiện tại         |
| `isLoading`       | `boolean`                                       | Trạng thái loading                  |
| `addItem`         | `(product: Product, quantity?: number) => void` | Thêm sản phẩm vào giỏ hàng          |
| `updateQuantity`  | `(productId: string, quantity: number) => void` | Cập nhật số lượng                   |
| `removeItem`      | `(productId: string) => void`                   | Xóa sản phẩm                        |
| `clear`           | `() => void`                                    | Xóa toàn bộ giỏ hàng                |
| `isInCart`        | `(productId: string) => boolean`                | Kiểm tra sản phẩm có trong giỏ hàng |
| `getItemQuantity` | `(productId: string) => number`                 | Lấy số lượng sản phẩm               |
| `getTotalItems`   | `() => number`                                  | Lấy tổng số lượng                   |
| `getTotal`        | `() => number`                                  | Lấy tổng tiền                       |

### Ví dụ sử dụng

```tsx
import { useCart } from "@/hooks/useCart";

function MyComponent() {
  const {
    cart,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    isInCart,
    getItemQuantity,
    getTotalItems,
    getTotal,
  } = useCart();

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (product) => {
    addItem(product, 2); // Thêm 2 sản phẩm
  };

  // Xóa sản phẩm
  const handleRemoveItem = (productId) => {
    removeItem(productId);
  };

  // Cập nhật số lượng
  const handleUpdateQuantity = (productId, quantity) => {
    updateQuantity(productId, quantity);
  };

  // Kiểm tra sản phẩm có trong giỏ hàng
  const isProductInCart = isInCart("product-123");

  // Lấy số lượng sản phẩm
  const quantity = getItemQuantity("product-123");

  // Lấy tổng số lượng
  const totalItems = getTotalItems();

  // Lấy tổng tiền
  const total = getTotal();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Tổng số sản phẩm: {totalItems}</p>
      <p>Tổng tiền: {formatPrice(total)}</p>
      {/* Render cart UI */}
    </div>
  );
}
```

### Features

- ✅ Tự động lưu vào localStorage
- ✅ Tự động load từ localStorage khi mount
- ✅ Tính toán tự động các giá trị
- ✅ Type-safe với TypeScript
- ✅ Optimized với useCallback
- ✅ Error handling cho localStorage

---

## Utility Functions

### formatPrice

Format giá tiền theo định dạng VND.

```tsx
import { formatPrice } from "@/lib/shop/utils";

formatPrice(29990000); // "29.990.000 ₫"
formatPrice(29990000, "USD"); // "$29,990,000.00"
```

### calculateSubtotal

Tính tổng tiền phụ của giỏ hàng.

```tsx
import { calculateSubtotal } from "@/lib/shop/utils";

const subtotal = calculateSubtotal(cartItems);
```

### addToCart

Thêm sản phẩm vào giỏ hàng.

```tsx
import { addToCart } from "@/lib/shop/utils";

const newCart = addToCart(currentCart, product, 2);
```

### updateCartItemQuantity

Cập nhật số lượng sản phẩm trong giỏ hàng.

```tsx
import { updateCartItemQuantity } from "@/lib/shop/utils";

const newCart = updateCartItemQuantity(currentCart, "product-123", 5);
```

### removeFromCart

Xóa sản phẩm khỏi giỏ hàng.

```tsx
import { removeFromCart } from "@/lib/shop/utils";

const newCart = removeFromCart(currentCart, "product-123");
```

### hasDiscount

Kiểm tra sản phẩm có đang giảm giá không.

```tsx
import { hasDiscount } from "@/lib/shop/utils";

if (hasDiscount(product)) {
  console.log("Sản phẩm đang giảm giá!");
}
```

### getDiscountPercentage

Tính phần trăm giảm giá.

```tsx
import { getDiscountPercentage } from "@/lib/shop/utils";

const discountPercent = getDiscountPercentage(product);
console.log(`Giảm ${discountPercent}%`);
```

---

## Best Practices

### 1. Error Handling

```tsx
// Luôn kiểm tra null/undefined
if (!product) {
  return <div>Sản phẩm không tồn tại</div>;
}

// Kiểm tra loading state
if (isLoading) {
  return <div>Đang tải...</div>;
}
```

### 2. Performance Optimization

```tsx
// Sử dụng useCallback cho event handlers
const handleAddToCart = useCallback(
  (product) => {
    addItem(product);
  },
  [addItem]
);

// Sử dụng useMemo cho expensive calculations
const filteredProducts = useMemo(() => {
  return products.filter((p) => p.category === selectedCategory);
}, [products, selectedCategory]);
```

### 3. Accessibility

```tsx
// Thêm ARIA labels
<button
  aria-label={`Thêm ${product.name} vào giỏ hàng`}
  onClick={() => onAddToCart(product)}
>
  Thêm vào giỏ
</button>

// Keyboard navigation
<div
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onProductClick(product);
    }
  }}
>
  {/* Product content */}
</div>
```

### 4. Responsive Design

```tsx
// Sử dụng Tailwind responsive classes
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Grid items */}
</div>
```

### 5. Type Safety

```tsx
// Luôn định nghĩa types cho props
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

// Sử dụng type guards
function isValidProduct(product: any): product is Product {
  return (
    product &&
    typeof product.id === "string" &&
    typeof product.name === "string"
  );
}
```
