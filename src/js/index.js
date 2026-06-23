import "./header/header.js";
import "./form/form.js";
import "./form/validation.js";
import { startObserver } from "./observer/observer.js";
import {
  handleMouseMove,
  handleMouseUp,
  lightbox,
} from "./lightbox/lightbox.js";

const aboutObserver = startObserver({
  selector: ".about-block",
  threshold: 0,
  marginY: "0px",
});
const h2Observer = startObserver({
  selector: "h2",
  threshold: 0,
  marginY: "30px",
});

const kurseImgObserver = startObserver({
    selector: ".kurs-image",
    threshold: 0,
  marginY: "0px",
})

const kurseTxtObserver = startObserver({
    selector: ".kurs-text",
    threshold: 0,
  marginY: "0px",
})


queueMicrotask(() => {
  const cb = () => {
    const items = document.querySelectorAll(".accordion-item");
    items.forEach((item, index) => {
      setTimeout(
        () => {
          item.classList.add("visible");
        },
        900 + index * 1000,
      );
    });
  };
  const accordionObserver = startObserver({
    selector: ".accordion",
    callback: cb,
    threshold: 0.2,
    marginY: "5px",
  });
});

document.addEventListener("click", lightbox);
const lightboxEl = document.getElementById("lightbox");
if (lightboxEl)
  lightboxEl.addEventListener("close", () => {
    const img = lightboxEl.querySelector(".lightboxImg");
    history.replaceState(null, null, " ");
    if (img) img.src = "";

    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("mousemove", handleMouseMove);
  });
