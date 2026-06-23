import { phrases } from "../data/phrases";

const textElement = document.getElementById("dynamic-text");
let currentIndex = 0;

export function changeText() {
  if (!textElement) return;

  textElement.classList.add("fade-out");
  textElement.classList.remove("fade-in");

  setTimeout(() => {
    currentIndex = (currentIndex + 1) % phrases.length;

    textElement.textContent = phrases[currentIndex];
    textElement.classList.add("fade-in");
    textElement.classList.remove("fade-out");

    setTimeout(() => {
      changeText();
    }, 5000);
  }, 1000);
}
