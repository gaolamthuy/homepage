/**
 * Configuration cho ứng dụng
 * Quản lý các URL, API endpoints và cấu hình khác
 */

// Kiotviet configuration
export const KIOTVIET_CONFIG = {
  // Base URL của Kiotviet store
  BASE_URL: "https://gaolamthuy.kiotviet.vn",

  // URL pattern cho sản phẩm
  PRODUCT_URL_PATTERN: "/san-pham/{slug}",

  // URL pattern cho danh mục
  CATEGORY_URL_PATTERN: "/danh-muc/{slug}",

  // URL cho trang chủ
  HOME_URL: "/",

  // URL cho trang liên hệ
  CONTACT_URL: "/lien-he",
};

/**
 * Tạo URL cho sản phẩm trên Kiotviet
 * @param product - Sản phẩm cần tạo URL
 * @returns URL đầy đủ đến trang sản phẩm trên Kiotviet
 */
export function getKiotvietProductUrl(product: any): string {
  // Ưu tiên sử dụng glt_slug nếu có
  const slug = product.glt?.glt_slug || product.code || product.id;
  return `${
    KIOTVIET_CONFIG.BASE_URL
  }${KIOTVIET_CONFIG.PRODUCT_URL_PATTERN.replace("{slug}", slug)}`;
}

/**
 * Tạo URL cho danh mục trên Kiotviet
 * @param categoryName - Tên danh mục
 * @returns URL đầy đủ đến trang danh mục trên Kiotviet
 */
export function getKiotvietCategoryUrl(categoryName: string): string {
  // Tạo slug từ tên danh mục
  const slug = categoryName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/[^a-z0-9\s-]/g, "") // Chỉ giữ chữ cái, số, khoảng trắng, dấu gạch ngang
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-") // Loại bỏ dấu gạch ngang liên tiếp
    .trim();

  return `${
    KIOTVIET_CONFIG.BASE_URL
  }${KIOTVIET_CONFIG.CATEGORY_URL_PATTERN.replace("{slug}", slug)}`;
}

/**
 * Mở URL trong tab mới
 * @param url - URL cần mở
 */
export function openInNewTab(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}

// App configuration
export const APP_CONFIG = {
  // Tên ứng dụng
  NAME: "Gạo Lâm Thúy",

  // Mô tả
  DESCRIPTION: "Gạo, Tấm, Nếp,...",

  // Theme colors
  COLORS: {
    primary: "amber",
    secondary: "slate",
  },

  // Social media links
  SOCIAL: {
    facebook: "https://facebook.com/gaolamthuy",
    zalo: "https://zalo.me/gaolamthuy",
    phone: "tel:+84901234567",
    email: "mailto:info@gaolamthuy.vn",
  },

  // Contact information
  CONTACT: {
    phone: "+84 901 234 567",
    email: "info@gaolamthuy.vn",
    address: "123 Đường ABC, Quận XYZ, TP.HCM",
  },
};
