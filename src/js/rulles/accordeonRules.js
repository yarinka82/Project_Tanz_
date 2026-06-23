export function accordeonRules(e) {
  const btn = e.target.closest(".accordion-header");
  if (!btn) return;

  const currentItem = btn.closest(".accordion-item");
 const activeItem = document.querySelector(".accordion-item.active");
   const content = currentItem.querySelector(".accordion-content");
    const currentBtn = currentItem.querySelector(".accordion-header")

  if (activeItem) {
    activeItem.classList.remove("active");
    activeItem.querySelector(".accordion-content").style.maxHeight = null;
    
    const activeBtn = activeItem.querySelector(".accordion-header");

    if (activeBtn) {
      activeBtn.setAttribute("aria-expanded", "false");
    activeBtn.setAttribute('aria-label', 'Regeln anzeigen');
  }}
  if (currentItem !== activeItem) {
    currentItem.classList.add("active");
    content.style.maxHeight = content.scrollHeight + 32 + 'px';
    currentBtn.setAttribute("aria-expanded", "true");
     currentBtn.setAttribute('aria-label', 'Regeln ausblenden'); 
  }
}
