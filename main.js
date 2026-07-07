import { changeText } from "./src/js/hero/hero.js";
import "./src/js/index.js";
import { startObserver } from "./src/js/observer/observer.js";
import "./src/js/rulles/rulles.js";
import { slaider } from "./src/js/slaider/slaider.js";

slaider();

document.addEventListener("DOMContentLoaded", () => {
    changeText();

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