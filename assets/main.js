// Main SASS file for styling
import "/assets/style.scss";

// DOM Selectors
const body = document.querySelector("body");
const income = document.querySelector("#income");
const leaveDays = document.querySelector("#leave-days");
const tuberculosisCheck = document.querySelector("#tuberculosis");
const button = document.querySelector("#submit");
const totalCompensationDays = document.querySelector(".total-compensation-days");
const totalCompensationSum = document.querySelector(".total-sum");
const modal = document.getElementById("myModal"); // Get the modal
const modalText = document.getElementById("modal-text");
const span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal

// PRELOADER
const preloader = document.querySelector("#preloader");

const fadeOutEffect = setInterval(() => {
  if (!preloader.style.opacity) {
    preloader.style.opacity = 1;
  }
  if (preloader.style.opacity > 0) {
    preloader.style.opacity -= 0.3;
  } else {
    clearInterval(fadeOutEffect);
    preloader.classList.add("hide-preloader");
  }
}, 200);

// Calculate function - fires on button click
const calculate = () => {
    
  // Input check
  if (leaveDays.value < 0 || income.value < 0) {
    showModal("Enter a positive number.");
    return;
  }
  if (income.value == "" && leaveDays.value == "") {
    showModal("Please enter income and sick-leave days.");
    return;
  }
  if (income.value == "") {
    showModal("Please enter income and sick-leave days.");
    return;
  } else if (leaveDays.value == "") {
    showModal("Please enter days on sick-leave.");
    return;
  }

  // Check if user has tuberculosis - if they do, maxCompensationdays = 240, otherwise 182
  let maxCompensationDays = hasTuberculosis(tuberculosisCheck.checked);

  // Calculate daily allowance from last six months average income
  const dailyAllowance = calculateDailyAllowance(income.value);

  // Calculate compensation days
  const { employerCompensationDays, healthInsuranceCompensationdays } = getCompensationDays(leaveDays.value, maxCompensationDays);

  // Employer compensation sum
  const employerCompensationSum = dailyAllowance.toFixed(2) * employerCompensationDays;

  // Health insurance compensation sum
  const healthInsuranceCompensationSum = dailyAllowance.toFixed(2) * healthInsuranceCompensationdays;

  // Total compensation sum
  const totalAllowance = employerCompensationSum + healthInsuranceCompensationSum;


  // ==============================
  // Displaying the results in HTML
  // ==============================

  // Employer compensates
  document.querySelector(".employer-compensates").innerHTML = employerCompensationDays + " days";
  document.querySelector(".employer-compensates-sum").innerHTML = employerCompensationSum.toFixed(2) + "???";
  document.querySelector(".daily-allowance-sum-employer").innerHTML = dailyAllowance.toFixed(2) + "???";

  // Insurance compensates
  document.querySelector(".insurance-compensates").innerHTML = healthInsuranceCompensationdays + " days";
  document.querySelector(".insurance-compensates-sum").innerHTML = healthInsuranceCompensationSum.toFixed(2) + "???";
  document.querySelector(".daily-allowance-sum-insurance").innerHTML = dailyAllowance.toFixed(2) + "???";

  // Total
  totalCompensationDays.innerHTML = leaveDays.value;
  totalCompensationSum.innerHTML = totalAllowance.toFixed(2) + "???";
};

// Fire calculate function on button click
button.addEventListener("click", calculate);

// Fire calculate function on "Enter" key press
body.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      calculate();
    }
});

// Calculate and return compensation days
const getCompensationDays = (leaveDays, maxCompensationDays) => {
  let employerCompensationDays = 0;
  let healthInsuranceCompensationdays = 0;

  // Calculate compensation days
  if (leaveDays > 0 && leaveDays < 4) {
    employerCompensationDays = 0;
    healthInsuranceCompensationdays = 0;
  } else if (leaveDays >= 4 && leaveDays < 9) {
    employerCompensationDays = leaveDays - 3;
    healthInsuranceCompensationdays = 0;
  } else if (leaveDays >= 9) {
    employerCompensationDays = 5;
    healthInsuranceCompensationdays =
      leaveDays - employerCompensationDays - 3;

    if (leaveDays > maxCompensationDays) {
      healthInsuranceCompensationdays =
        maxCompensationDays - employerCompensationDays - 3;
    }
  }

  return {
    employerCompensationDays: employerCompensationDays,
    healthInsuranceCompensationdays: healthInsuranceCompensationdays,
  };
}

// Check if user has tuberculosis and return maximum compensation days 
const hasTuberculosis = (check) => {
  let maxCompensationDays = 0;
  if (check) {
    maxCompensationDays = 240;
  } else {
    maxCompensationDays = 182;
  }

  return maxCompensationDays;
};

// Calculate daily allowance based on the last six months average income
const calculateDailyAllowance = (sum) => {
  const compensationRate = sum * 0.7; // 70% of the monthly income

  // const lastSixMonthsDays = 183; // 365 / 2, six months days to calculate the daily allowance

  const daysInMonth = 30;

  const dailyAllowance = compensationRate / daysInMonth;

  return dailyAllowance;
};

/** Show modal for 2 seconds */
const showModal = (text) => {
    modal.style.display = "block";
    modalText.innerHTML = "<p>" + text + "</p>";

    setTimeout(() => {
        modal.style.display = "none";
    }, 2000);
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

