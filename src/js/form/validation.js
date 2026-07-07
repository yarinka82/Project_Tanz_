const form = document.getElementById("bookingForm");
const inputDay = document.getElementById("day");
const inputTime = document.getElementById("time");
const inputSelect = document.getElementById("select");
const inputName = document.getElementById("name");
const nameError = document.getElementById("name-error");
const dataError = document.getElementById("data-error");
const selectError = document.getElementById("select-error");
const timeError = document.getElementById("time-error");

const validation = (e) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = inputDay.value;
  const time = inputTime.value;
  let selectedDay = null;
  let selectedDataTime = null;
  let isToday = false;
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);

  if (day) {
    selectedDay = new Date(`${day}`);
    selectedDay.setHours(0, 0, 0, 0);
    isToday = selectedDay.getTime() === today.getTime();
  }

    if (day && time) {
       selectedDataTime = new Date(`${day}T${time}`);
  }

  if (inputName.value.trim().length < 2) {
    e.preventDefault();
    nameError.textContent = "Der Name muss mindestens 2 Zeichen lang sein";
  } else {
    nameError.textContent = "";
  }

  if (!inputSelect.value) {
    e.preventDefault();
    selectError.textContent = "Bitte wählen Sie einen der Werte aus";
  } else {
    selectError.textContent = "";
  }

  if (!day) {
    e.preventDefault();
    dataError.textContent = "Bitte wählen Sie ein Datum aus";
  } else if (selectedDay < today) {
    e.preventDefault();
    dataError.textContent = "Das Datum darf nicht in der Vergangenheit liegen";
  } else if (selectedDay && selectedDay > maxDate) {
    e.preventDefault();
    dataError.textContent = "Wählen Sie ein Datum innerhalb von 2 Monaten";
  } else {
    dataError.textContent = "";
  }

  if (!time || time === "") {
    e.preventDefault();
    timeError.textContent = "Bitte wählen Sie eine Uhrzeit aus";
  } else if (selectedDataTime && isToday && selectedDataTime <= new Date()) {
    e.preventDefault();
    timeError.textContent =
      "Die Zeit ist bereits vergangen. Sonstiges auswählen";
  } else if (time < "08:00" || time > "21:00") {
    e.preventDefault();
    timeError.textContent = "Wählen Sie eine Zeit zwischen 8.00 und 21.00 Uhr";
  } else {
    timeError.textContent = "";
  }
};

form.addEventListener("input", validation);
form.addEventListener("blur", validation, true);
form.addEventListener("submit", validation);
