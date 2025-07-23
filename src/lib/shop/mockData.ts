/**
 * Data service cho shop online
 * Fetch dữ liệu từ API thật
 */

import type { Product, Category, ProductAttribute } from "@/types/shop";

// API URL từ environment variable
const API_URL = import.meta.env.PUBLIC_API_URL;

/**
 * Fetch dữ liệu sản phẩm từ API
 * @returns Promise với danh sách sản phẩm từ API
 */
async function fetchProductsFromAPI(): Promise<any[]> {
  try {
    const apiUrl = API_URL + (API_URL.includes('?') ? '&' : '?') + 't=' + Date.now();
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Lấy products từ item đầu tiên của array
    return data[0]?.products || [];
  } catch (error) {
    console.error("Lỗi khi fetch products từ API:", error);
    return [];
  }
}

/**
 * Chuyển đổi data từ API sang format Product với attributes đầy đủ
 * @param apiData - Dữ liệu từ API
 * @param allProducts - Tất cả sản phẩm để lấy attributes
 * @returns Product object
 */
function mapApiDataToProduct(apiData: any, allProducts: any[]): Product {
  // Chỉ lấy attributes của chính sản phẩm này, không lấy từ master/variants
  const productAttributes = apiData.attributes || [];

  return {
    id: String(apiData.id),
    name: apiData.name || apiData.fullName || "Sản phẩm không tên",
    description: apiData.description || "Không có mô tả",
    price: apiData.basePrice || 0,
    originalPrice: undefined, // Có thể thêm logic tính giá gốc nếu cần
    images: apiData.images || [],
    category: apiData.categoryName || "Khác",
    tags: productAttributes.map((attr: any) => attr.attributeValue),
    inStock: apiData.allowsSale && apiData.isActive,
    stockQuantity: apiData.weight || 0,
    rating: 5, // Mặc định 5 sao, có thể thay đổi sau
    reviewCount: 0, // Mặc định 0 review, có thể thay đổi sau
    createdAt: new Date(apiData.createdDate || Date.now()),
    updatedAt: new Date(apiData.modifiedDate || Date.now()),
    // Lưu trữ attributes của chính sản phẩm này
    attributes: productAttributes,
    // Lưu trữ các trường khác từ API
    fullName: apiData.fullName,
    code: apiData.code,
    barCode: apiData.barCode,
    categoryId: apiData.categoryId,
    allowsSale: apiData.allowsSale,
    type: apiData.type,
    hasVariants: apiData.hasVariants,
    unit: apiData.unit,
    conversionValue: apiData.conversionValue,
    isActive: apiData.isActive,
    isLotSerialControl: apiData.isLotSerialControl,
    isBatchExpireControl: apiData.isBatchExpireControl,
    masterProductId: apiData.masterProductId,
    // GLT custom fields
    glt: apiData.glt,
  };
}

/**
 * Lấy tất cả master products từ API với attributes đầy đủ
 * @returns Promise với danh sách master products
 */
export async function getAllProducts(): Promise<Product[]> {
  const apiData = await fetchProductsFromAPI();
  // Chỉ lấy master products (masterProductId = null/undefined)
  const masterProducts = apiData.filter(
    (product: any) => !product.masterProductId
  );
  return masterProducts.map((product) => mapApiDataToProduct(product, apiData));
}

/**
 * Lấy sản phẩm theo ID
 * @param id - ID sản phẩm
 * @returns Promise với sản phẩm hoặc undefined
 */
export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((product) => product.id === id);
}

/**
 * Lấy sản phẩm theo danh mục
 * @param categoryName - Tên danh mục
 * @returns Promise với danh sách sản phẩm
 */
export async function getProductsByCategory(
  categoryName: string
): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((product) => product.category === categoryName);
}

/**
 * Lấy tất cả danh mục từ API (chỉ lấy những danh mục có glt_is_active = true)
 * @returns Promise với danh sách danh mục
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    const apiUrl2 = API_URL + (API_URL.includes('?') ? '&' : '?') + 't=' + Date.now();
    const response = await fetch(apiUrl2, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Lấy categories từ item thứ hai của array và filter theo glt_is_active = true
    const categoriesData = data[1]?.product_categories || [];

    // Filter chỉ lấy những danh mục có glt_is_active = true
    const activeCategories = categoriesData.filter(
      (cat: any) => cat.glt?.glt_is_active === true
    );

    return activeCategories.map((cat: any) => ({
      id: String(cat.categoryId),
      name: cat.categoryName,
      description: `Danh mục ${cat.categoryName}`,
    }));
  } catch (error) {
    console.error("Lỗi khi fetch categories từ API:", error);
    return [];
  }
}

/**
 * Lấy danh mục theo ID
 * @param id - ID danh mục
 * @returns Promise với danh mục hoặc undefined
 */
export async function getCategoryById(
  id: string
): Promise<Category | undefined> {
  const categories = await getAllCategories();
  return categories.find((category) => category.id === id);
}

/**
 * Tìm kiếm sản phẩm
 * @param query - Từ khóa tìm kiếm
 * @returns Promise với danh sách sản phẩm
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getAllProducts();
  const lowerQuery = query.toLowerCase();

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Lấy sản phẩm nổi bật (có thể filter theo logic riêng)
 * @param limit - Số lượng sản phẩm tối đa
 * @returns Promise với danh sách sản phẩm nổi bật
 */
export async function getFeaturedProducts(
  limit: number = 8
): Promise<Product[]> {
  const products = await getAllProducts();
  // Logic lấy sản phẩm nổi bật: có thể là sản phẩm mới nhất, giá cao nhất, etc.
  return products
    .filter((product) => product.inStock)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}
