import PhotoSwipe from "https://cdn.jsdelivr.net/npm/photoswipe@5.3.8/dist/photoswipe.esm.min.js";
import PhotoSwipeLightbox from "https://cdn.jsdelivr.net/npm/photoswipe@5.3.8/dist/photoswipe-lightbox.esm.min.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("PhotoSwipe init started");

  // Prevent default behavior for all gallery links
  const productLinks = document.querySelectorAll("#products-gallery a");
  productLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Link click prevented by photoswipe-init.js");
    });
  });

  // Initialize PhotoSwipe with better options
  const lightbox = new PhotoSwipeLightbox({
    gallery: "#products-gallery",
    children: "a",
    pswpModule: PhotoSwipe,
    showHideAnimationType: "zoom",
    loop: true,
    padding: { top: 20, bottom: 40, left: 20, right: 20 },
    mainClass: "pswp--custom-bg",
    closeOnVerticalDrag: true,
    clickToCloseNonZoomable: true,
    imageClickAction: "zoom",
    tapAction: "toggle-controls",
  });

  // Add caption handler
  lightbox.on("uiRegister", function () {
    lightbox.pswp.ui.registerElement({
      name: "custom-caption",
      order: 9,
      isButton: false,
      appendTo: "root",
      html: "",
      onInit: (el, pswp) => {
        lightbox.pswp.on("change", () => {
          const currSlideElement = lightbox.pswp.currSlide.data.element;
          let captionText = "";

          if (currSlideElement) {
            // Get product name from data attribute or from parent element
            const productItem = currSlideElement.closest(".product-item");
            if (productItem) {
              const nameLabel = productItem.querySelector("span");
              captionText = nameLabel ? nameLabel.textContent.trim() : "";
            }
          }

          el.innerHTML = captionText;
        });
      },
    });
  });

  // Image loading events
  lightbox.on("contentLoad", (e) => {
    console.log("PhotoSwipe contentLoad:", e.content.data.src);
  });

  lightbox.on("contentLoadFail", (e) => {
    console.error("PhotoSwipe content load failed:", e);

    // Try to load a fallback image
    const placeholderUrl =
      e.content.data.element?.getAttribute("data-fallback");
    if (placeholderUrl) {
      e.content.data.src = placeholderUrl;
      e.content.state = "loading";
    }
  });

  // Initialize the lightbox
  lightbox.init();
  console.log("PhotoSwipe initialized");
});
