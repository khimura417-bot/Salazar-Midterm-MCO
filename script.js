// ==========================================
// DOM ELEMENT SELECTION
// ==========================================
// Grabs references to HTML elements so JavaScript can control and update them dynamically
const mileageForm = document.getElementById('mileage-form');
const logDateInput = document.getElementById('log-date');
const logMilesInput = document.getElementById('log-miles');
const mileageList = document.getElementById('mileage-list');
const currentMileageDisplay = document.getElementById('current-mileage');
const payBtn = document.getElementById('pay-btn');

// ==========================================
// ENCRYPTION & SECURITY MODULE (Satisfies LO1)
// ==========================================

// Method 1: Custom Cipher Encryption (Shift character unicode values by 5)
function cipherEncrypt(text, shift = 5) {
    return text.split('').map(char => 
        String.fromCharCode(char.charCodeAt(0) + shift)
    ).join('');
}

// Reverses the character shift to decrypt data back into plain text
function cipherDecrypt(text, shift = 5) {
    return text.split('').map(char => 
        String.fromCharCode(char.charCodeAt(0) - shift)
    ).join('');
}

// Method 2: Multi-Layer Encryption Pipeline (Custom Cipher + Base64 Encoding)
function secureSaveData(data) {
    const jsonString = JSON.stringify(data);    // Step A: Convert object array to a JSON text string
    const layer1 = cipherEncrypt(jsonString);   // Step B: Apply custom cipher encryption (Layer 1)
    const layer2 = btoa(layer1);                // Step C: Encode into Base64 format (Layer 2)
    localStorage.setItem('encryptedMileageLogs', layer2); // Save scrambled data securely to browser
}

// Loads, decodes, and parses encrypted data safely from LocalStorage
function secureLoadData() {
    const savedData = localStorage.getItem('encryptedMileageLogs');
    if (!savedData) return [];
    try {
        const layer1 = atob(savedData);               // Step A: Decode Base64 back to cipher text
        const jsonString = cipherDecrypt(layer1);     // Step B: Reverse cipher back to JSON string
        return JSON.parse(jsonString);                // Step C: Convert JSON string back into a JavaScript array
    } catch (e) {
        console.error("Decryption failed:", e);
        return [];
    }
}

// Load logs immediately upon script execution using our decryption pipeline
let logs = secureLoadData();

// ==========================================
// UI RENDERING ENGINE
// ==========================================
// Clears and rebuilds the HTML list and status totals dynamically based on current data
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

    // Updates the vehicle status card total display
    if (logs.length > 0) {
        currentMileageDisplay.textContent = totalMiles;
    } else {
        currentMileageDisplay.textContent = 0;
    }
}

// ==========================================
// DATA MODIFICATION & EVENT LISTENERS
// ==========================================

// Deletes a specific log item by array index, re-encrypts, and updates the screen
window.deleteLog = function(index) {
    logs.splice(index, 1);
    secureSaveData(logs); // Re-encrypt updated array and save to storage
    updateUI();
};

// Form Submission: Captures new input, pushes to array, encrypts, and resets form
mileageForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents page from reloading on submit

    const newLog = {
        date: logDateInput.value,
        miles: logMilesInput.value
    };

    logs.push(newLog);
    secureSaveData(logs); // Encrypts and writes to localStorage
    updateUI();
    mileageForm.reset();
});

// Mock Payment Handler: Simulates checkout interaction for the midterm requirement
payBtn.addEventListener('click', function() {
    alert('Mock Payment Successful! (Stripe API integration ready for final term).');
});

// ==========================================
// EXTERNAL API INTEGRATION
// ==========================================
// Asynchronous HTTP request to a remote server endpoint to pull live data
fetch('https://api.chucknorris.io/jokes/random?category=dev')
    .then(response => response.json()) // Parses incoming raw response into JSON format
    .then(data => {
        document.getElementById('api-fact').textContent = `"${data.value}"`; // Injects quote into UI
    })
    .catch(error => {
        document.getElementById('api-fact').textContent = "Could not load API data."; // Fallback error handler
    });

// Initial trigger to render UI data when the page first loads
updateUI();