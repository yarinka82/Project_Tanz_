export function startObserver({
  selector,
  callback,
  classToAdd = "visible",
  threshold = 0.2,
  delay = false,
  marginY = "0px",
  repeit = false,
}) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          if (typeof callback === "function") callback(entry.target);

          if (delay) {
            entry.target.style.transitionDelay = `${index * delay}s`;
          }

          entry.target.classList.add(classToAdd);
        } else {
          if (repeit) {
            entry.target.classList.remove(classToAdd);
            if (delay) {
              entry.target.style.transitionDelay = "0s";
            }
          }
        }
        //   if (typeof callback === "function") obs.unobserve(entry.target);
      });
    },
    { threshold: threshold, rootMargin: `0px 0px ${marginY} 0px` },
  );

  document.querySelectorAll(selector).forEach((el) => observer.observe(el));
  console.log("observer");
  return observer;
}
