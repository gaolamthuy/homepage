// Định nghĩa interface cho dữ liệu sản phẩm
export interface Product {
  kiotvietId: number;
  slug: string;
  fullName: string;
  code: string;
  unit: string;
  category: {
    name: string;
    rank: number;
    color: string;
  };
  basePrice: number;
  cost: number;
  wholeP10Price: number;
  description: string;
  modifiedDate: string;
  image?: {
    updatedAt: number | null;
    visible: boolean;
    sortOrder: number | null;
    urls: {
      original: string | null;
      thumbnail: string | null;
      zoom: string | null;
    };
  } | null; // 👈 thêm null vào đây
  placeholderUrl?: string; // new code: fallback placeholder
}

// Định nghĩa interface cho response từ API
export interface ApiResponse {
  version: number;
  lastUpdated: string;
  imageConfig: {
    thumbnail: {
      width: number;
      height: number;
    };
    zoom: {
      width: number;
      height: number;
    };
  };
  totalCount: number;
  products: Product[];
}

// Function để lấy data từ API
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      "https://cdn.gaolamthuy.vn/product-images/manifest.json?v=" + Date.now()
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    return data.products.map((product) => {
      const hasValidImage =
        product.image?.urls?.thumbnail &&
        !product.image.urls.thumbnail.includes("placehold.co");

      return {
        ...product,
        placeholderUrl: `https://placehold.co/300x300?text=${encodeURIComponent(
          product.fullName
        )}`,
        image: hasValidImage ? product.image : null,
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Function để lấy danh sách categories từ products
export function getCategories(products: Product[]) {
  const categories = products.reduce((acc, product) => {
    if (!acc.some((cat) => cat.name === product.category.name)) {
      acc.push({
        name: product.category.name,
        rank: product.category.rank,
        color: product.category.color,
      });
    }
    return acc;
  }, [] as { name: string; rank: number; color: string }[]);

  // Sắp xếp theo rank
  return categories.sort((a, b) => a.rank - b.rank);
}
