// Select DOM elements
const mileageForm = document.getElementById('mileage-form');
const logDateInput = document.getElementById('log-date');
const logMilesInput = document.getElementById('log-miles');
const mileageList = document.getElementById('mileage-list');
const currentMileageDisplay = document.getElementById('current-mileage');
const payBtn = document.getElementById('pay-btn');

// Load logs from localStorage when page opens
let logs = JSON.parse(localStorage.getItem('mileageLogs')) || [];

// Function to update the screen
function updateUI() {
    mileageList.innerHTML = '';
    let totalMiles = 0;

    logs.forEach((log, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>📅 ${log.date} - <strong>${log.miles} miles</strong></span>
            <button onclick="deleteLog(${index})" class="delete-btn">❌</button>
        `;
        mileageList.appendChild(li);
        
        totalMiles = Number(log.miles);
    });

    // Update current mileage on dashboard
    if (logs.length > 0) {
        currentMileageDisplay.textContent = totalMiles;
    } else {
        currentMileageDisplay.textContent = 0;
    }
}

// Function to delete a specific log
window.deleteLog = function(index) {
    logs.splice(index, 1);
    localStorage.setItem('mileageLogs', JSON.stringify(logs));
    updateUI();
};

// Handle form submission
mileageForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const newLog = {
        date: logDateInput.value,
        miles: logMilesInput.value
    };

    logs.push(newLog);
    localStorage.setItem('mileageLogs', JSON.stringify(logs));

    updateUI();
    mileageForm.reset();
});

// Mock payment button
payBtn.addEventListener('click', function() {
    alert('Mock Payment Successful! (In final term, we will hook this up to Stripe API).');
});

// Fetch data from public API
fetch('https://api.chucknorris.io/jokes/random?category=dev')
    .then(response => response.json())
    .then(data => {
        document.getElementById('api-fact').textContent = `"${data.value}"`;
    })
    .catch(error => {
        document.getElementById('api-fact').textContent = "Could not load API data.";
    });

// Run on page load
updateUI();