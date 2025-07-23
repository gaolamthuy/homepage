import React, { useRef } from "react";
import PhotoSwipe from "photoswipe";
import "photoswipe/dist/photoswipe.css";

interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
  className?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  images,
  className = "",
}) => {
  const pswpRef = useRef<HTMLDivElement>(null);

  // PhotoSwipe open handler
  const openPhotoSwipe = (index: number) => {
    const items = images.map((image) => ({
      src: image.src,
      w: image.width,
      h: image.height,
      alt: image.alt,
    }));
    const options = {
      index,
      bgOpacity: 0.9,
      showHideOpacity: true,
      closeOnScroll: false,
      clickToCloseNonZoomable: false,
      wheelToZoom: true,
      imageClickAction: "close" as "close",
      tapAction: "close" as "close",
      doubleTapAction: false as false,
    };
    const pswp = new PhotoSwipe({
      dataSource: items,
      ...options,
      pswpModule: PhotoSwipe,
    });
    pswp.on("uiRegister", function () {
      pswp.ui?.registerElement({
        name: "custom-caption",
        order: 9,
        isButton: false,
        appendTo: "root",
        html: "Caption text",
        onInit: (el, pswp) => {
          pswp.on("change", () => {
            const currSlideElement = pswp.currSlide;
            if (currSlideElement) {
              el.innerHTML = currSlideElement.data.alt || "";
            }
          });
        },
      });
      // Thêm bullets indicator
      pswp.ui?.registerElement({
        name: "bulletsIndicator",
        className: "pswp__bullets-indicator",
        appendTo: "wrapper",
        onInit: (el, pswp) => {
          const bullets: HTMLDivElement[] = [];
          let bullet;
          let prevIndex = -1;
          for (let i = 0; i < pswp.getNumItems(); i++) {
            bullet = document.createElement("div");
            bullet.className = "pswp__bullet";
            bullet.onclick = (e) => {
              pswp.goTo(bullets.indexOf(e.target as HTMLDivElement));
            };
            el.appendChild(bullet);
            bullets.push(bullet);
          }
          pswp.on("change", () => {
            if (prevIndex >= 0) {
              bullets[prevIndex].classList.remove("pswp__bullet--active");
            }
            bullets[pswp.currIndex].classList.add("pswp__bullet--active");
            prevIndex = pswp.currIndex;
          });
        },
      });
    });
    pswp.init();
  };

  // Chỉ hiển thị 1 ảnh thumbnail (ảnh đầu tiên)
  const thumbnail = images[0];

  return (
    <div className={className + " flex justify-center"}>
      <div
        className="cursor-zoom-in"
        style={{ maxWidth: 600, maxHeight: 400 }}
        onClick={() => openPhotoSwipe(0)}
      >
        <img
          src={thumbnail.src}
          alt={thumbnail.alt}
          className="rounded-lg shadow-md object-cover"
          style={{
            width: "100%",
            maxWidth: 600,
            maxHeight: 400,
            height: "auto",
          }}
          loading="lazy"
        />
      </div>
      {/* PhotoSwipe root element (hidden, for accessibility) */}
      <div
        className="pswp"
        ref={pswpRef}
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default PhotoGallery;
