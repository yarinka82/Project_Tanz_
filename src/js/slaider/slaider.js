import { photos } from "../data/fotos";
import { Modal } from "../modalImg/modalImg";

// Modal.init();

export function slaider() {
  const container = document.querySelector(".slider-wrapper");
  const track = document.querySelector(".slider-track");

  if (!container || !track) return;

  let currentSlide = 0;
  let scrollWidth = 0;
  let speed = 1;
  let startIndex = Math.floor(Math.random() * photos.length);
  let visible = [];
  let n = 0;

  let fullWidthSlide = 0;
  let widthTrack = 0;
  let widthContainer = 0;

  track.innerHTML = `<div class="slide">
          <a href="/gallery.html" aria-label="Zur Fotogalerie wechseln und mehr Bilder ansehen">
            <img src="${photos[startIndex].image}" alt="${photos[startIndex].name}" />
          </a>
        </div>`;

  function render() {
    const firstSlide = track.firstElementChild;
    if (!firstSlide) return;

    const widthSlide = firstSlide.offsetWidth;
    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.gap) || 0;
    fullWidthSlide = widthSlide + gap;
    widthTrack = track.scrollWidth;
    widthContainer = container.offsetWidth;
    const n = Math.floor((widthContainer - gap) / fullWidthSlide) + 2;
    // container.style.width = ((n - 2) * widthSlide + (n - 3) * gap) + "px";
    visible = [];
    let currentIndex = startIndex;

    for (let index = 0; index < n; index++) {
      visible.push(photos[currentIndex]);
      currentIndex = (currentIndex + 1) % photos.length;
    }

    const marque = visible
      .map((p) => {
        return `<li class="slide">
         <a href="/gallery.html" aria-label="Zur Fotogalerie wechseln und mehr Bilder ansehen">
            <img src="${p.image}" alt="${p.name}" />
            </a>
          </li>`;
      })
      .join("");

    track.innerHTML = marque;

    widthTrack = n * fullWidthSlide;
    scrollWidth = 0;
    track.style.transform = `translateX(0px)`;
  }

  render();

  let nextIndex = startIndex;

  const isSlajder = () => widthTrack > widthContainer;

  function step() {
    if (!isSlajder()) return;

    if (!Modal.isPaused) {
      scrollWidth += speed;

      track.style.transform = `translateX(-${scrollWidth}px)`;
    }

    if (scrollWidth > fullWidthSlide) {
      nextIndex = (nextIndex + 1) % photos.length;
      const currentFirstSlide = track.firstElementChild;
      const img = currentFirstSlide.querySelector("img");
      img.src = photos[nextIndex].image;
      track.appendChild(currentFirstSlide);
      scrollWidth -= fullWidthSlide;
      track.style.transform = `translateX(-${scrollWidth}px)`;
    }

    // setTimeout(() => step(), 30);
    requestAnimationFrame(step);
  }
  setTimeout(() => {
    requestAnimationFrame(step);
  }, 50);

  window.addEventListener("resize", render);

  // track.addEventListener("mouseover", (e) => Modal.open(e, visible));
  // track.addEventListener("mouseout", (e) => Modal.closeViaMouse(e));
  // Modal.modal.addEventListener("mouseleave",  (e) =>Modal.close());
  // document.addEventListener("keydown", (e) => {
  //   if (e.key === "Escape") {
  //     Modal.close();
  //   }
  // });
}
