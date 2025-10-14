/**
 * Service để fetch và quản lý shared images
 * Độc lập với product images, dễ dàng xóa/nâng cấp sau này
 */

export interface SharedImage {
  Key: string;
  Size: string;
  LastModified: string;
  ETag: string;
  StorageClass: string;
  url: string;
}

export interface SharedImagesResponse {
  products_shared_image: SharedImage[];
}

/**
 * Cache để tránh fetch nhiều lần
 */
let sharedImagesCache: SharedImage[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

/**
 * Lấy danh sách shared images từ API
 * Có cache để tránh fetch nhiều lần
 */
export async function getSharedImages(): Promise<SharedImage[]> {
  // Kiểm tra cache
  const now = Date.now();
  if (sharedImagesCache && now - cacheTimestamp < CACHE_DURATION) {
    return sharedImagesCache;
  }

  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL + "/products_shared_image.json";
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = (await res.json()) as SharedImagesResponse;
    const images = data.products_shared_image || [];

    // Cập nhật cache
    sharedImagesCache = images;
    cacheTimestamp = now;

    return images;
  } catch (error) {
    console.warn("Failed to fetch shared images:", error);
    return [];
  }
}

/**
 * Lấy ảnh main từ shared images
 * Ưu tiên: 1kg, 5kg, 10kg, 50kg, compare, dinh luong
 */
export async function getSharedMainImages(): Promise<SharedImage[]> {
  const images = await getSharedImages();
  return images.filter((img) => img.Key.includes("/main/"));
}

/**
 * Lấy ảnh thumbnail từ shared images
 */
export async function getSharedThumbnailImages(): Promise<SharedImage[]> {
  const images = await getSharedImages();
  return images.filter((img) => img.Key.includes("/thumbnail/"));
}

/**
 * Lấy ảnh main theo tên file (không có extension)
 * Ví dụ: getSharedImageByName('1kg') -> 1kg.jpg
 */
export async function getSharedImageByName(
  name: string
): Promise<SharedImage | null> {
  const mainImages = await getSharedMainImages();
  return mainImages.find((img) => img.Key.includes(`/${name}.jpg`)) || null;
}

/**
 * Lấy ảnh thumbnail theo tên file
 */
export async function getSharedThumbnailByName(
  name: string
): Promise<SharedImage | null> {
  const thumbnailImages = await getSharedThumbnailImages();
  return (
    thumbnailImages.find((img) => img.Key.includes(`/${name}.jpg`)) || null
  );
}

/**
 * Tạo fallback images cho product khi thiếu ảnh
 * Trả về array các ảnh shared để bổ sung
 */
export async function getFallbackImages(): Promise<
  Array<{ url: string; role: string }>
> {
  const mainImages = await getSharedMainImages();
  const thumbnailImages = await getSharedThumbnailImages();

  const fallbackImages: Array<{ url: string; role: string }> = [];

  // Thêm ảnh main
  mainImages.forEach((img) => {
    const name = img.Key.split("/").pop()?.replace(".jpg", "") || "unknown";
    fallbackImages.push({
      url: img.url,
      role: `shared-main-${name}`,
    });
  });

  // Thêm ảnh thumbnail
  thumbnailImages.forEach((img) => {
    const name = img.Key.split("/").pop()?.replace(".jpg", "") || "unknown";
    fallbackImages.push({
      url: img.url,
      role: `shared-thumbnail-${name}`,
    });
  });

  return fallbackImages;
}
