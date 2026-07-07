import { ImageGesture } from "../ImageGesture/ImageGesture";


let imgActive = null;



const gestureLightbox = new ImageGesture();

export function lightbox(e) {
const lightboxEl = document.getElementById("lightbox");
const img = lightboxEl?.querySelector(".lightboxImg");
imgActive = img;


  if (!img) return;

  if (e.target.classList.contains("img-lightbox")) {
    img.src = e.target.dataset.full;
    img.alt = e.target.alt;
    img.style.cursor = "zoom-in";

    lightboxEl.showModal();
      gestureLightbox.init(img);
  }

  if (
    e.target.classList.contains("lightbox-close") ||
    e.target === lightboxEl
  ) {
    lightboxEl.close();
    gestureLightbox.reset();
  }
}

let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;
let currentScale = 1;
let isDragging = false;

const ZOOM_MIN = 1;
const ZOOM_MAX = 5;
const ZOOM_SPEED = 0.15;

export function handleClickZoom(e) {
  e.preventDefault();

   imgActive = e.currentTarget;

  currentScale = Math.min(currentScale + ZOOM_SPEED, ZOOM_MAX);
  imgActive.style.cursor = "grab";
  updateImgTransform();
}

export function resetZoom(e) {
   imgActive = e.currentTarget;

  currentScale = 1;
  updateImgTransform(imgActive);
  imgActive.style.cursor = "zoom-in";
}

export function handleWheelZoom(e) {
  e.preventDefault();

   imgActive = e.currentTarget;

  if (e.deltaY < 0) {
    currentScale = Math.min(currentScale + ZOOM_SPEED, ZOOM_MAX);
  } else {
    currentScale = Math.max(currentScale - ZOOM_SPEED, ZOOM_MIN);
  }

  if (currentScale === 1) {
    translateX = 0;
    translateY = 0;
    imgActive.style.cursor = "zoom-in";
  } else {
    imgActive.style.cursor = "grab";
  }
  updateImgTransform(imgActive);
}

export function updateImgTransform(img) {
  // imgActive.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
}

export function handleMouseDown(e) {
  if (currentScale < ZOOM_MIN) return;
  e.preventDefault();
   imgActive = e.currentTarget;
  imgActive.style.cursor = "grabbing";

  isDragging = true;

  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
}

export function handleMouseUp() {
  if (!isDragging) return;
  isDragging = false;

  if (imgActive) {
    imgActive.style.cursor = "grab";
  }
}

export function handleMouseMove(e) {
  if (!isDragging) return;
  // e.preventDefault();

  const rect = imgActive.getBoundingClientRect();

  const viewWidth = rect.width / currentScale;
  const viewHeight = rect.height / currentScale;

  const maxX = Math.max(0, (rect.width - viewWidth) / 2);
  const maxY = Math.max(0, (rect.height - viewHeight) / 2);

  let targetX = e.clientX - startX;
  let targetY = e.clientY - startY;

  translateX = Math.min(Math.max(targetX, -maxX), maxX);
  translateY = Math.min(Math.max(targetY, -maxY), maxY);

  if (imgActive) {
    updateImgTransform(imgActive);
  }
}
