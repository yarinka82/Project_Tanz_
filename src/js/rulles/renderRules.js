import { rules } from "../data/rules.js"

export default function renderRules() {
    const accordion = document.querySelector(".accordion")
    const list = rules;
    if (!list || !accordion) return;

    accordion.innerHTML = list.map((item, index )=> {
         return `<li class="accordion-item">
              <button class="accordion-header" aria-expanded="false" 
        aria-label="Regeln anzeigen"
        aria-controls="rules-content-${index}">
                ${item.question}
              </button>
              <div class="accordion-content"  id="rules-content-${index}">
                <p>
                 ${item.answer}
                </p>
              </div>
            </li>`
    }).join("")

}