import "./header/header.js";
import "./form/form.js";
import "./form/validation.js";
import { startObserver } from "./observer/observer.js";
import {
  handleMouseMove,
  handleMouseUp,
  lightbox,
} from "./lightbox/lightbox.js";
import { renderYearAge } from "./year/year.js";

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


document.addEventListener("click", lightbox);
const lightboxEl = document.getElementById("lightbox");
if (lightboxEl)
  lightboxEl.addEventListener("close", () => {
    const img = lightboxEl.querySelector(".lightboxImg");
    history.replaceState(null, null, " ");
    if (img) img.src = "";

    // window.removeEventListener("mouseup", handleMouseUp);
    // window.removeEventListener("mousemove", handleMouseMove);
  });


  renderYearAge();