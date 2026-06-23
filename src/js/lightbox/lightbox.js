export function lightbox(e) {
  const lightboxEl = document.getElementById("lightbox");
  console.log("🚀 ~ lightbox ~ lightboxEl:", lightboxEl);
  const img = lightboxEl?.querySelector(".lightboxImg");
  console.log("🚀 ~ lightbox ~ img:", img);

  if (!lightboxEl || !img) return;

  if (e.target.classList.contains("img-lightbox")) {
    img.src = e.target.src;
      console.log("🚀 ~ lightbox ~ img.src:", img.src)
      img.alt = e.target.alt;
      img.style.cursor = "zoom-in"
    startX = 0;
    startY = 0;
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    lightboxEl.showModal();

    updateImgTransform(img);

    img.addEventListener("wheel", handleWheelZoom);
    img.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  if (
    e.target.classList.contains("lightbox-close") ||
    e.target === lightboxEl
  ) {
    lightboxEl.close();
    img.removeEventListener("wheel", handleWheelZoom);
    img.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
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

export function handleWheelZoom(e) {
  e.preventDefault();

  const img = e.currentTarget;
  console.log("🚀 ~ handleWheelZoom ~ img:", img)

  if (e.deltaY < 0) {
    console.log("🚀 ~ handleWheelZoom ~ deltaY:", e.deltaY);
    currentScale = Math.min(currentScale + ZOOM_SPEED, ZOOM_MAX);
    console.log("🚀 ~ handleWheelZoom ~ currentScale:", currentScale);
  } else {
    currentScale = Math.max(currentScale - ZOOM_SPEED, ZOOM_MIN);
  }

  if (currentScale === 1) {
    translateX = 0;
    translateY = 0;
    img.style.cursor = "zoom-in";
  } else {
    img.style.cursor = "grab";
  }
  updateImgTransform(img);
}

export function updateImgTransform(img) {
  img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
}

export function handleMouseDown(e) {
  if (currentScale < ZOOM_MIN) return;
  e.preventDefault();
  const img = e.currentTarget;
  img.style.cursor = "grabbing";

  isDragging = true;

  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
}

export function handleMouseUp() {
  if (!isDragging) return;
  isDragging = false;
  const lightboxEl = document.getElementById("lightbox");
  const img = lightboxEl.querySelector(".lightboxImg");

  if (img) {
    img.style.cursor = "grab";
  }
}

export function handleMouseMove(e) {
  if (!isDragging) return;
  // e.preventDefault();

  const lightboxEl = document.getElementById("lightbox");
  const img = lightboxEl.querySelector(".lightboxImg");
  const rect = img.getBoundingClientRect();

  const viewWidth = rect.width / currentScale;
  const viewHeight = rect.height / currentScale;

  const maxX = Math.max(0, (rect.width - viewWidth) / 2);
  const maxY = Math.max(0, (rect.height - viewHeight) / 2);

  let targetX = e.clientX - startX;
  let targetY = e.clientY - startY;

  translateX = Math.min(Math.max(targetX, -maxX), maxX);
  translateY = Math.min(Math.max(targetY, -maxY), maxY);

  if (img) {
    updateImgTransform(img);
  }
}
