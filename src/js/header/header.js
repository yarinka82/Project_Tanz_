const currentPath = window.location.pathname;

document.querySelectorAll("nav a").forEach((link) => {
    if (
        link.getAttribute("href").startsWith(currentPath) &&
        currentPath !== "/"
    ) {
        link.classList.add("active");
    } else if (currentPath === "/index.html" && link.getAttribute("href") === "/") {
       link.classList.add("active");
    }
});

const nav = document.getElementById("nav");
const burger = document.querySelector(".burger");
const icon = burger.querySelector("i");

nav.addEventListener("click", (e) => {
    const menu = e.target.closest(".burger");
  if (menu) {
    nav.classList.toggle("open");
  }
  const isActive = nav.classList.contains("open");
  if (isActive) {
      document.body.style.overflowY = "hidden";
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times")
  } else {
      document.body.style.overflowY = "auto";
       icon.classList.remove("fa-times");
      icon.classList.add("fa-bars")
  }

  if (e.target.closest("nav li")) {
    nav.classList.remove("open");
    icon.classList.remove("fa-times");
      icon.classList.add("fa-bars")
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
