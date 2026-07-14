export function startObserver({
  selector,
  callback,
  classToAdd = "visible",
  threshold = 0.2,
  delay = false,
  marginY = "0px",
  repeit = false,
  targetSelector = null,
  invert = false
}) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, index) => {

        const activeTarget = targetSelector ? document.querySelector(targetSelector) : entry.target;
        console.log("🚀 ~ startObserver ~ activeTarget:", activeTarget)

        if (!activeTarget) return;

        const isTriggered = invert ? !entry.isIntersecting : entry.isIntersecting;


        if (isTriggered) {
          if (typeof callback === "function") callback(activeTarget);

          if (delay) {
            activeTarget.style.transitionDelay = `${index * delay}s`;
          }

          activeTarget.classList.add(classToAdd);
        } else {
          if (repeit || invert) {
            activeTarget.classList.remove(classToAdd);
            if (delay) {
              activeTarget.style.transitionDelay = "0s";
            }
          }
        }
        //   if (typeof callback === "function") obs.unobserve(entry.target);
      });
    },
    { threshold: threshold, rootMargin: `0px 0px ${marginY} 0px` },
  );

  document.querySelectorAll(selector).forEach((el) => observer.observe(el));

  return observer;
}
