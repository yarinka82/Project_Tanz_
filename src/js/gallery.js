import "./index.js";
import { getVisible, renderGallery } from "./gallery/gallery";
import { Modal } from "./modalImg/modalImg.js";
import { startObserver } from "./observer/observer.js";

let galleryObserver = null;
const sentinel = document.querySelector(".gallery-sentinel");
const gallery = document.getElementById("gallery");

function initGalery() {
  if (gallery) {
    Modal.init();
    renderGallery();
    gallery.addEventListener("click", (e) =>
      Modal.open(e, getVisible(), hasGalleryNext),
    );

    startGalleryObserver();
  }
}

const cb = () => {
  const isModalActive = Modal.modal && Modal.modal.classList.contains("active");

  if (!isModalActive) {
    hasGalleryNext();
  }
};

initGalery();

function hasGalleryNext() {
  const hasMore = renderGallery();
  if (!hasMore && galleryObserver && sentinel) {
    galleryObserver.unobserve(sentinel);
  }
  return hasMore;
}

export function stopGalleryObserver() {
  galleryObserver.disconnect();
}

export function startGalleryObserver() {
  if (!sentinel) return;
  galleryObserver = startObserver({
    selector: ".gallery-sentinel",
    callback: cb,
    marginY: "200px",
  });
}
