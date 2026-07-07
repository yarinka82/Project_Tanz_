import { ImageGesture } from "../ImageGesture/ImageGesture";

export const Modal = {
  modal: null,
  track: null,
  imgActive: null,
  isPaused: false,
  isAnimating: false,
  currentIndex: 0,
  list: [],
  lastDx: null,
  // startX: 0,
  // startY: 0,
  isPointer: null,
  cancelTimer: null,

  init() {
    if (this.modal) return;
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div class="preview-modal">
      <div class="container-modal">
      <button type="button" aria-label="Galerie schließen" class="btnClose">x</button>
      <button type="button" aria-label="Vorheriges Bild" class="btnNav btnPrev">❮</button>
      <button type="button" aria-label="Nächstes Bild" class="btnNav btnNext">❯</button>
        <div class="thumb">
        <ul class="track">
          <li class="modal-slide"><img class="imgModal" src="" alt="" /></li>
              <li class="modal-slide"><img class="imgModal" src="" alt="" /></li>
              <li class="modal-slide"><img class="imgModal" src="" alt="" /></li>
        </ul>
        </div>
      </div>
      </div>`,
    );
    this.modal = document.querySelector(".preview-modal");

    this.track = this.modal.querySelector(".track");
    const slidesModal = this.track.querySelectorAll(".modal-slide");
    this.imgActive = slidesModal[1].querySelector("img");

    const isGallery = window.location.pathname.includes("gallery");
    const modal = document.querySelector(".container-modal");

    gestureGalery.init(this.imgActive, {
      onGestureMove: ({ dx, dy }) => {

        this.lastDx = dx;
         if (Math.abs(dx) > Math.abs(dy)) {
        this.track.style.transform = `translateX(calc(-33.333% + ${dx}px))`;

       } else {
          const scaleModal = Math.abs(dy/100);
          modal.style.transform = `scale(calc(1 - ${scaleModal}))`;
        } 
      },
      onGestureEnd: ({ action }) => {
        switch (action) {
          case "next":
            this.btnNavigation("next");
            break;

          case "prev":
            this.btnNavigation("prev");
            break;

          case "close":
            this.close();
            break;

          case "cancel":
            this.track.style.transform = "translateX(-33.333%)";
            break;

          case "restoreModal":
            modal.style.transform = "scale(1)";
            break;

          default:
            break;
        }
      },
    });

    this.modal.addEventListener("pointerdown", (e) =>
      this.handleModalEvents(e, isGallery),
    );
    // this.modal.addEventListener("pointerup", (e) => this.swipeNavigation(e));
    document.addEventListener("keydown", (e) => this.keyNavigation(e));
  },

  updateTrackContent(direction = false) {
    let len = this.list.length;
    if (len === 0) return;

    if (
      (this.currentIndex === len - 2 || this.currentIndex === len - 1) &&
      this.hasGalleryNext &&
      direction === "next"
    ) {
      const isLoad = this.hasGalleryNext();
      if (isLoad) {
        len = this.list.length;
      }
    }

    const prevIndex = (this.currentIndex - 1 + len) % len;
    const nextIndex = (this.currentIndex + 1) % len;

    const slidesModal = this.track.querySelectorAll(".modal-slide");

    const imgPrev = slidesModal[0].querySelector("img");
    this.imgActive = slidesModal[1].querySelector("img");
    const imgNext = slidesModal[2].querySelector("img");

    gestureGalery.setImage(this.imgActive);

    if (!direction) {
      this.imgActive.src = this.list[this.currentIndex].full;
      imgPrev.src = this.list[prevIndex].full;
      imgNext.src = this.list[nextIndex].full;

      this.imgActive.alt = this.list[this.currentIndex].alt;
      imgPrev.alt = this.list[prevIndex].alt;
      imgNext.alt = this.list[nextIndex].alt;
    }

    if (direction === "prev") imgPrev.src = this.list[prevIndex].full;
    if (direction === "next") imgNext.src = this.list[nextIndex].full;

    if (direction === "prev") imgPrev.alt = this.list[prevIndex].alt;
    if (direction === "next") imgNext.alt = this.list[nextIndex].alt;
  },

  open(e, list, hasGalleryNext = false) {
    const modal = document.querySelector(".container-modal");
    modal.style.transform = "scale(1)";

    const slideActive = e.target.closest(".slide");
    if (!slideActive) return;

    this.list = list;

    this.hasGalleryNext = hasGalleryNext;
    this.isPaused = true;
    this.isAnimating = false;

    const img = slideActive.querySelector("img");
    // const currentSrc = img.getAttribute("src");
    const currentSrc = img.dataset.full;
    this.currentIndex = this.list.findIndex((sl) => sl.full === currentSrc);

    if (this.currentIndex === -1) this.currentIndex = 0;

    this.track.style.transition = "none";
    this.track.style.transform = "translateX(-33.333%)";
    this.updateTrackContent();

    const rect = slideActive.getBoundingClientRect();

    this.modal.style.setProperty(
      "--origin-x",
      `${rect.left + rect.width / 2}px`,
    );
    this.modal.style.setProperty(
      "--origin-y",
      `${rect.top + rect.height / 2}px`,
    );

    this.modal.classList.add("active");
  },

  handleModalEvents(e, isGallery) {
    if (e.target.closest(".btnNext")) {
      this.btnNavigation("next");
      return;
    }
    if (e.target.closest(".btnPrev")) {
      this.btnNavigation("prev");
      return;
    }
    if (
      e.target.closest(".btnClose") ||
      !e.target.closest(".container-modal")
    ) {
      this.close();
      return;
    }

    // this.startX = e.clientX;
    // this.startY = e.clientY;
    // this.isPointer = true;
    // e.preventDefault();

    // this.cancelTimer = setTimeout(() => {
    //   this.startX = 0;
    //   this.startY = 0;
    //   this.isPointer = false;
    //   if (e.target.closest(".preview-modal") && !isGallery) {
    //     window.location.href = "/gallery";
    //     return;
    //   }
    // }, 500);
  },

  closeViaMouse(e) {
    if (
      !e.relatedTarget ||
      (!e.relatedTarget.closest(".slide") &&
        !e.relatedTarget.closest(".preview-modal"))
    ) {
      this.close();
    }
  },

  close() {
    if (this.modal) {
      this.modal.classList.remove("active");
      this.isPaused = false;
      this.imgActive = null;
      gestureGalery.reset();
    }
  },

  keyNavigation(e) {
    const key = e.key.toLowerCase();
    if (key === "escape" || key === "5" || key === "s") {
      Modal.modal.classList.remove("active");
    }
    if (
      key === "6" ||
      key === "d" ||
      key === "arrowright" ||
      key === "arrowdown" ||
      key === "2"
    ) {
      Modal.btnNavigation("next");
    }
    if (
      key === "4" ||
      key === "8" ||
      key === "arrowleft" ||
      key === "arrowup" ||
      key === "a"
    ) {
      Modal.btnNavigation("prev");
    }
  },

  btnNavigation(direction) {
    if (
      !this.modal ||
      !this.modal.classList.contains("active") ||
      this.isAnimating
    )
      return;

    this.isAnimating = true;
    this.track.style.transition =
      "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)";

    const slidesModal = this.track.querySelectorAll(".modal-slide");

    const firstSlide = slidesModal[0];
    const lastSlide = slidesModal[2];

    if (direction === "next") {
      this.track.style.transform = "translateX(-66.66%)";
      this.currentIndex = (this.currentIndex + 1) % this.list.length;
    }
    if (direction === "prev") {
      this.track.style.transform = "translateX(0)";
      this.currentIndex =
        (this.currentIndex - 1 + this.list.length) % this.list.length;
    }
    this.track.addEventListener(
      "transitionend",
      () => {
        this.track.style.transition = "none";

        if (direction === "next") {
          this.track.appendChild(firstSlide);
        }
        if (direction === "prev") {
          this.track.insertBefore(lastSlide, this.track.firstElementChild);
        }

        this.track.style.transform = "translateX(-33.33%)";
        void this.track.offsetWidth;
        this.updateTrackContent(direction);

        this.isAnimating = false;
      },
      { once: true },
    );
  },

};

let imgActive = Modal.imgModal;

const gestureGalery = new ImageGesture();
