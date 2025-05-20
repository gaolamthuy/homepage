import PhotoSwipeLightbox from "https://cdn.jsdelivr.net/npm/photoswipe@5.4.2/dist/photoswipe-lightbox.esm.min.js";
import PhotoSwipe from "https://cdn.jsdelivr.net/npm/photoswipe@5.4.2/dist/photoswipe.esm.min.js";
import "/node_modules/photoswipe/dist/photoswipe.css";

const lightbox = new PhotoSwipeLightbox({
  gallery: "#products-gallery",
  children: "a",
  pswpModule: PhotoSwipe,
});

lightbox.init();
