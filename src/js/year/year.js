const day = 7;
const month = 3;
const year =2003;



export const renderYearAge = () => {


const yearEl = document.getElementById("currentYear");

const today = new Date();

const currentDay = today.getDay();
const currentMonth = today.getMonth()+1;
const currentYear = today.getFullYear();

yearEl.textContent = currentYear;


let difYear = currentYear - year;
const ageEl = document.getElementById("age-katya");

if (!ageEl) return;

if (currentMonth < month || currentMonth === month && currentDay < day) {
    difYear--;
}
ageEl.textContent = difYear;
}