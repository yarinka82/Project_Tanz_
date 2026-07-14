const currentPath = window.location.pathname;
let lastScroll = 0;

document.querySelectorAll("nav a").forEach((link) => {
  if (
    link.getAttribute("href").startsWith(currentPath) &&
    currentPath !== "/"
  ) {
    link.classList.add("active");
  } else if (
    currentPath === "/index.html" &&
    link.getAttribute("href") === "/"
  ) {
    link.classList.add("active");
  }
});

const header = document.querySelector(".header-katharsis");
const nav = document.getElementById("nav");
const burger = document.querySelector(".burger");
const icon = burger.querySelector("use");
const btnUp = document.querySelector(".btnUp");

nav.addEventListener("click", (e) => {
  const menu = e.target.closest(".burger");
  if (menu) {
    nav.classList.toggle("open");
  }
  const isActive = nav.classList.contains("open");
  if (isActive) {
    document.body.style.overflowY = "hidden";
    // icon.classList.remove("fa-bars");
    // icon.classList.add("fa-times")
    burger.setAttribute("aria-label", "Menü schließen");
    icon.setAttribute("href", "/image/sprite.svg#x");
  } else {
    document.body.style.overflowY = "auto";
    //  icon.classList.remove("fa-times");
    // icon.classList.add("fa-bars")
    burger.setAttribute("aria-label", "Menü öffnen");
    icon.setAttribute("href", "/image/sprite.svg#menu");
  }

  if (e.target.closest("nav li")) {
    nav.classList.remove("open");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
    document.body.style.overflowY = "auto";
  }
});

const mobile = window.matchMedia("(max-width: 767px)");
mobile.addEventListener("change", (e) => {
  if (!e.matches) {
    nav.classList.remove("open");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    nav.classList.remove("open");
  }
});

document.addEventListener("scroll", (e) => {
  let scrollTop = window.scrollY;

  if (scrollTop > 400) {
    btnUp.classList.add("visible");
  } else {
    btnUp.classList.remove("visible");
  }

  if (scrollTop > lastScroll && scrollTop > 100) {
    header.classList.add("hidden");
  } else if (scrollTop < lastScroll) {
    header.classList.remove("hidden");
  }
  lastScroll = scrollTop <= 0 ? 0 : scrollTop;
});
