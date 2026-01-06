/**
 * PhotoSwipe Gallery Script
 * Xử lý logic mở gallery bảng giá với PhotoSwipe
 */

import PhotoSwipe from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

// Album data và base URL sẽ được truyền từ component
declare global {
  interface Window {
    __ALBUM_DATA__?: any[];
    __API_BASE_URL__?: string;
  }
}

let albumData: any[] = [];
let baseUrl = '';
let lightbox: PhotoSwipeLightbox | null = null;

/**
 * Khởi tạo PhotoSwipe Lightbox
 */
function initPhotoSwipe() {
  if (lightbox) {
    return; // Đã được khởi tạo rồi
  }

  try {
    lightbox = new PhotoSwipeLightbox({
      gallery: '#photoswipe-gallery',
      children: 'a',
      showHideOpacity: true,
      bgOpacity: 0.8,
      pswpModule: PhotoSwipe
    });

    // Cấu hình PhotoSwipe
    lightbox.on('uiRegister', function() {
      if (lightbox?.pswp && lightbox.pswp.ui) {
        lightbox.pswp.ui.registerElement({
          name: 'custom-caption',
          onInit: (el, pswp) => {
            el.innerHTML = '<div class="pswp__caption"><div class="pswp__caption__center"></div></div>';
          }
        });
      }
    });
  } catch (error) {
    console.error('Error initializing PhotoSwipe:', error);
  }
}

/**
 * Fetch album data từ API
 * @returns Promise<any[]> - Mảng các album items
 */
async function fetchAlbumData(): Promise<any[]> {
  try {
    if (!baseUrl || baseUrl.trim() === '') {
      console.warn('PUBLIC_API_URL không được cấu hình, album gallery sẽ không hoạt động');
      return [];
    }
    
    // Đảm bảo baseUrl không có trailing slash
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const apiUrl = `${cleanBaseUrl}/album_website.json`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status} khi fetch ${apiUrl}`);
      return [];
    }
    
    const data: any = await response.json();
    return data.album_website || [];
  } catch (error) {
    console.error('Error fetching album data:', error);
    if (error instanceof TypeError && error.message.includes('Failed to parse URL')) {
      console.error('URL không hợp lệ. Vui lòng kiểm tra PUBLIC_API_URL trong .env.local');
    }
    return [];
  }
}

/**
 * Lấy URL ảnh từ album item
 * Ưu tiên public_url_with_rev, fallback về r2_dev_url
 * @param item - Album item từ API
 * @returns URL ảnh để hiển thị
 */
function getImageUrl(item: any): string {
  return item.public_url_with_rev || item.r2_dev_url || '';
}

/**
 * Load kích thước ảnh từ URL
 * @param url - URL của ảnh
 * @returns Promise với width và height của ảnh
 */
function loadImageSize(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      // Fallback về kích thước mặc định nếu không load được
      resolve({ width: 1200, height: 1600 });
    };
    img.src = url;
  });
}

/**
 * Mở PhotoSwipe gallery với dữ liệu album
 */
async function openGallery() {
  // Đảm bảo PhotoSwipe đã được khởi tạo
  if (!lightbox) {
    initPhotoSwipe();
    if (!lightbox) {
      alert('PhotoSwipe chưa sẵn sàng. Vui lòng thử lại sau.');
      return;
    }
  }

  // Fetch album data nếu chưa có
  if (albumData.length === 0) {
    albumData = await fetchAlbumData();
  }

  if (albumData.length === 0) {
    console.error('No album data available');
    alert('Không có dữ liệu album. Vui lòng thử lại sau.');
    return;
  }

  // Tạo gallery items với URL đúng từ API
  const galleryItemsPromises = albumData.map(async (item) => {
    const imageUrl = getImageUrl(item);
    if (!imageUrl) {
      console.warn(`Không tìm thấy URL cho item: ${item.title}`);
      return null;
    }

    // Load kích thước ảnh thực tế
    const { width, height } = await loadImageSize(imageUrl);

    return {
      src: imageUrl,
      width: width,
      height: height,
      alt: item.title || 'Bảng giá',
      title: item.title || 'Bảng giá'
    };
  });

  // Chờ tất cả ảnh load xong
  const galleryItems = (await Promise.all(galleryItemsPromises)).filter(item => item !== null) as any[];

  if (galleryItems.length === 0) {
    console.error('No valid gallery items');
    alert('Không có ảnh nào để hiển thị.');
    return;
  }

  // Tạo HTML cho gallery
  const galleryHTML = galleryItems.map((item) => 
    `<a href="${item.src}" data-pswp-width="${item.width}" data-pswp-height="${item.height}" data-pswp-srcset="${item.src} ${item.width}w" target="_blank">
      <img src="${item.src}" alt="${item.alt}" style="display: none;" />
    </a>`
  ).join('');

  // Render gallery
  const galleryContainer = document.getElementById('photoswipe-gallery');
  if (galleryContainer && lightbox) {
    galleryContainer.innerHTML = galleryHTML;
    galleryContainer.classList.remove('hidden');
    
    // Mở gallery từ item đầu tiên
    lightbox.loadAndOpen(0, galleryItems);
  }
}

/**
 * Khởi tạo gallery với dữ liệu từ server
 * @param serverAlbumData - Dữ liệu album từ server-side
 * @param apiBaseUrl - Base URL của API
 */
export function initPriceGallery(serverAlbumData: any[], apiBaseUrl: string) {
  albumData = serverAlbumData || [];
  baseUrl = apiBaseUrl || '';
  
  // Khởi tạo PhotoSwipe
  initPhotoSwipe();
  
  // Hàm setup event listener
  function setupGalleryButton() {
    const galleryButton = document.querySelector('[data-gallery-trigger]');
    if (galleryButton) {
      galleryButton.addEventListener('click', function(e) {
        e.preventDefault();
        openGallery();
      });
    }
  }
  
  // Xử lý sự kiện click vào nút gallery
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupGalleryButton);
  } else {
    setupGalleryButton();
  }
}

// Export function để sử dụng từ bên ngoài
export { openGallery };

