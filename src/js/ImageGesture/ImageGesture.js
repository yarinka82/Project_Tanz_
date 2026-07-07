import { updateImgTransform } from "../lightbox/lightbox";

const ZOOM_MIN = 1;
const ZOOM_MAX = 5;
const ZOOM_SPEED = 0.15;

export class ImageGesture {
  imgActive = null;
  rect = {};
  baseWidth = 0;
  baseHeight = 0;
  startX = 0;
  startY = 0;
  translateX = 0;
  translateY = 0;
  dX = 0;
  dY = 0;
  currentScale = 1;
  isDragging = false;
  cancelTimer = null;
  lastTap = 0;
  now = 0;
  pointers = new Map();
  isPinching = false;
  initialPinchDistance = 0;

  init(img, callback = {}) {
    if (!img) return;

    // this.imgActive = img;
    this.onGestureMove = callback.onGestureMove;
    this.onGestureEnd = callback.onGestureEnd;

    this.addListener();
    this.setImage(img);

    // updateImgTransform();
  }

  destroy() {
    // if (!this.imgActive) return;
    this.removeListener();
    this.imgActive = null;
  }

  addListener() {
    if (!this.imgActive) return;

    this.imgActive.addEventListener("wheel", this.handleWheelZoom);
    this.imgActive.addEventListener("pointerdown", this.handlePointerDown);
    window.addEventListener("pointermove", this.handlePointerMove);
    window.addEventListener("pointerup", this.handlePointerUp);
    window.addEventListener("pointercancel", this.handlePointerCancel);
    window.addEventListener("resize", this.handleResize);
  }

  removeListener() {
    if (!this.imgActive) return;

    this.imgActive.removeEventListener("wheel", this.handleWheelZoom);
    this.imgActive.removeEventListener("pointerdown", this.handlePointerDown);
    window.removeEventListener("pointermove", this.handlePointerMove);
    window.removeEventListener("pointerup", this.handlePointerUp);
    window.removeEventListener("pointercancel", this.handlePointerCancel);
    window.removeEventListener("resize", this.handleResize);
  }

  reset() {
    this.currentScale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.dX = 0;
    this.dY = 0;

    this.updateImgTransform();
    if (this.imgActive) {
      this.imgActive.style.cursor = "zoom-in";
    }
  }

  getRect() {
    this.rect = this.imgActive.getBoundingClientRect();
    this.baseWidth = this.rect.width;
    this.baseHeight = this.rect.height;
  }

  handleResize = () => {
    this.getRect();
  };

  clampTranslate() {
    const scaleWidth = this.baseWidth * this.currentScale;
    const scaleHeight = this.baseHeight * this.currentScale;

    const maxX = (scaleWidth - this.baseWidth) / 2;
    const maxY = (scaleHeight - this.baseHeight) / 2;

    this.translateX = Math.min(Math.max(this.translateX, -maxX), maxX);
    this.translateY = Math.min(Math.max(this.translateY, -maxY), maxY);
  }

  updateImgTransform() {
    if (!this.imgActive) return;

    this.imgActive.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.currentScale})`;
  }

  handleClickZoom = (e) => {
    if (!this.imgActive) return;

    this.currentScale = Math.min(this.currentScale + ZOOM_SPEED, ZOOM_MAX);
    this.clampTranslate();
    this.updateImgTransform();

    this.imgActive.style.cursor = "grab";
  };

  handleWheelZoom = (e) => {
    e.preventDefault();

    if (e.deltaY < 0) {
      this.currentScale = Math.min(this.currentScale + ZOOM_SPEED, ZOOM_MAX);
    } else {
      this.currentScale = Math.max(this.currentScale - ZOOM_SPEED, ZOOM_MIN);
    }

    if (this.currentScale === 1) {
      this.imgActive.style.cursor = "zoom-in";
      this.translateX = 0;
      this.translateY = 0;
    } else {
      this.imgActive.style.cursor = "grab";
    }

    this.clampTranslate();
    this.updateImgTransform();
  };

  setImage(img) {
    if (!img || img === this.imgActive) return;

    this.removeListener();
    this.reset();
    this.imgActive = img;
    this.addListener();

    if (this.imgActive.complete && this.imgActive.naturalWidth > 0) {
      this.getRect();
    } else {
      this.imgActive.addEventListener(
        "load",
        () => {
          this.getRect();
        },
        { once: true },
      );
    }
  }

  startDrag(e) {
    this.now = performance.now();
    this.startX = e.clientX - this.translateX;
    this.startY = e.clientY - this.translateY;

    this.rect = this.imgActive.getBoundingClientRect();
  }

  stopDrag() {
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
  }

  startPinch() {
    const [p1, p2] = this.pointers.values();
    const difX = p2.x - p1.x;
    const difY = p2.y - p1.y;

    this.initialPinchDistance = Math.hypot(difX, difY);
  }

  handlePinch() {
    const [p1, p2] = this.pointers.values();
    const difX = p2.x - p1.x;
    const difY = p2.y - p1.y;

    const distance = Math.hypot(difX, difY);

    const scale = distance / this.initialPinchDistance;

    this.currentScale = Math.min(
      ZOOM_MAX,
      Math.max(ZOOM_MIN, this.currentScale * scale),
    );

    this.clampTranslate();
    this.updateImgTransform();
    this.initialPinchDistance = distance;
  }

  handlePointerDown = (e) => {
    // if (this.currentScale === 1) return;
    this.pointers.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY,
    });

    if (this.pointers.size === 1) {
      this.isDragging = true;
      this.startDrag(e);
    } else if (this.pointers.size === 2) {
      this.stopDrag();
      this.isPinching = true;
      this.startPinch();
    }
  };

  handleSingleTouch(e) {
    if (!this.isDragging) return;

    e.stopPropagation();

    if (this.currentScale > 1) {
      const targetX = e.clientX - this.startX;
      const targetY = e.clientY - this.startY;

      this.translateX = targetX;
      this.translateY = targetY;

      this.clampTranslate();
      this.updateImgTransform();
    } else if (this.currentScale === 1) {
      this.dX = e.clientX - this.startX;
      this.dY = e.clientY - this.startY;

      this.onGestureMove?.({ dx: this.dX, dy: this.dY });

      if (Math.abs(this.dX) > Math.abs(this.dY)) {
        if (this.dX > 80) {
          this.isDragging = false;
          this.onGestureEnd?.({ action: "prev" });
        } else if (this.dX < -80) {
          this.isDragging = false;
          this.onGestureEnd?.({ action: "next" });
        }
      } else {
        if (Math.abs(this.dY) > 120) {
          this.isDragging = false;
          this.onGestureEnd?.({ action: "close" });
        }
      }
    }
  }

  handlePointerUp = (e) => {
    // if (!this.isDragging) return;

    this.pointers.delete(e.pointerId);

    if (this.isPinching) {
      if (this.pointers.size < 2) {
        this.isPinching = false;
      }
      return;
    }

    if (this.isDragging) {
      this.isDragging = false;

      const now = performance.now();
      
      if (now - this.lastTap <= 300) {
        this.reset();
        clearTimeout(this.cancelTimer);

        this.lastTap = 0;

        return;
      }

      this.lastTap = now;
      const isShortClick = now - this.now < 250;
      const isNotDragging =
        Math.abs(e.clientX - (this.startX + this.translateX)) < 5 &&
        Math.abs(e.clientY - (this.startY + this.translateY)) < 5;

      if (isShortClick && isNotDragging) {

        this.cancelTimer = setTimeout(() => {
          this.currentScale =
            this.currentScale < 5 ? Math.floor(this.currentScale) + 1 : 1;

            this.clampTranslate();
          this.updateImgTransform();

          if (this.currentScale === 1) {
            this.imgActive.style.cursor = "zoom-in";
            this.translateX = 0;
            this.translateY = 0;
          } else {
            this.imgActive.style.cursor = "grab";
          }
        }, 200);

        return;
      }

      if (Math.abs(this.dX) > Math.abs(this.dY)) {
        if (Math.abs(this.dX) < 80) {
          this.onGestureEnd?.({ action: "cancel" });
        }
      } else if (Math.abs(this.dY) < 120) {
        this.onGestureEnd?.({ action: "restoreModal" });
      }

      if (this.pointers.size === 0) {
        this.stopDrag();
      }
    }
  };

  handlePointerMove = (e) => {
    if (!this.pointers.has(e.pointerId)) return;

    this.pointers.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY,
    });

    if (this.pointers.size === 1) {
      this.handleSingleTouch(e);
    } else if (this.pointers.size === 2) {
      this.handlePinch();
    }
  };

  handlePointerCancel = () => {
    this.pointers.clear();
    this.isDragging = false;
    this.isPinching = false;
  }

  allowSwipe() {
    return this.currentScale === 1 && !this.isDragging;
  }
}
