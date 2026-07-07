import './index.js';
import { getVisible, renderGallery } from "./gallery/gallery";
import { Modal } from './modalImg/modalImg.js';
import { startObserver } from './observer/observer.js';

let galleryObserver  = null;
const sentinel = document.querySelector(".gallery-sentinel");
Modal.init();
renderGallery();

gallery.addEventListener("click", (e) => Modal.open(e, getVisible(), hasGalleryNext));

if (sentinel) {
    const cb = () => {
        const isModalActive = Modal.modal && Modal.modal.classList.contains("active");

        if (!isModalActive) {
            hasGalleryNext();
        }
    }

galleryObserver  = startObserver({selector: ".gallery-sentinel", callback: cb, marginY: "200px"})
}


function hasGalleryNext() {
  const hasMore = renderGallery();
  if (!hasMore && galleryObserver&&sentinel ) {
    galleryObserver .unobserve(sentinel);
  }
  return hasMore;
}
