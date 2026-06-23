// const btnOpenForm = document.getElementById("openForm");
const popup = document.getElementById("popupForm");
const form = document.getElementById("bookingForm");

document.addEventListener("click", (e) => {
 if (e.target.closest("[data-openForm]")) {
     popup.classList.add("show");
     popup.ariaHidden = false;
  }
// });

// popup.addEventListener("click", (e) => {
    if (e.target.closest(".popup-close") || e.target === popup || e.target.closest(".btnClosed")) {
     document.activeElement.blur();
     popup.classList.remove("show");
     popup.ariaHidden = true;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
      popup.classList.remove("show");
      popup.ariaHidden = true;
  }
});

const handleSubmit = async (e) => {
  e.preventDefault();
    const formData = new FormData(form);
    const thanks = document.getElementById("thanksMsg");
    const errorMsg = document.getElementById("errorMsg");
    const btn = form.querySelector(".btn");

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });
      btn.disabled = true;
      
      if (response.ok) {
          thanks.style.display = "block";
          setTimeout(() => {
              thanks.style.display = "none";
              popup.classList.remove("show");
              popup.ariaHidden = true;
              document.activeElement.blur();
          }, 3500);
      } else {
         errorMsg.style.display = "block";
          setTimeout(() => {
              errorMsg.style.display = "none";
          }, 5000); 
      }
      btn.disabled = false;
  } catch (error) {
      errorMsg.style.display = "block";
          setTimeout(() => {
              errorMsg.style.display = "none";
          }, 5000);
  }
};

form.addEventListener("submit", handleSubmit);
