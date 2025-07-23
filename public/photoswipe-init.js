import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

export function initPhotoSwipe() {
  const gallery = document.querySelector("#homepage-gallery");
  if (gallery) {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#homepage-gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
  }
}
