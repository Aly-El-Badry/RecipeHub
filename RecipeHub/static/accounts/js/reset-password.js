// Import Libraries
import * as sec from "../../components/js/security.js";

// Global Flags
let invalidEmail = false;
let invalidCode = false;
let invalidPassword = false;

// Constants
const TEXT_FIELD_ERROR_STYLE = "box-shadow: 0 0 10px 1px red;";
const ERROR_MESSSAGE_STYLE = "color: red; font-size: smaller; font-weight: bold; padding: 0 0.5rem; margin: 0;";

// DOM Elements
const form = document.getElementById("form");
const email = document.getElementById("email");
const emailCont = document.getElementById("emailCont");
const codeBtn = document.getElementById("sendCode");
const password = document.getElementById("password");
const passwordCont = document.getElementById("passwordCont");
const code = document.getElementById("code");
const codeCont = document.getElementById("codeCont");

// TO BE REMOVED
let generatedCode = 0;
//////////////////////

// Shake Text Field
function shake(el) {
    let shakes = 0;
    const shakeInterval = setInterval(() => {
        el.style.transform = `translateX(${shakes % 2 === 0 ? -2 : 2}px)`;
        shakes++;
        if (shakes >= 6) {
        clearInterval(shakeInterval);
        el.style.transform = 'translateX(0)';
        }
    }, 50);
}

// Invalid Input Message
function addInvalidMessage(cont, msg, flag) {
    // Prevent adding mutiple messages
    if (flag) {return;}
    // Creating message element
    const err = document.createElement('p');
    // Adding the message content
    err.innerHTML = msg;
    // Styling the element
    err.style = ERROR_MESSSAGE_STYLE;
    // Appeding the element
    cont.appendChild(err);
}

if (localStorage.getItem("recipes") == null) {
    fetch('../../static/user/js/Data.json').then(response => {
        if (!response.ok) {
            throw new Error("Failed to read Data.json");
        }
    return response.json();
    }).then(recipes => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
    }).catch(error => {
        console.error("Error Loading Data.json");
    });
}

// Form Event Listener
form.addEventListener('submit', async function(event) {
    // Prevent Contacting the Server
    event.preventDefault();
    // Handling Invalid Email Stucture
    if (!(sec.isSafeEmail(email.value) && email.value)) {
        // Adding Invalid Message
        addInvalidMessage(emailCont, 'Invalid Email', invalidEmail);
        // Styling the Text Field
        email.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(email);
        // Setting the Flag
        invalidEmail = true;
    }
    // Handling Invalid Code
    if (!((/\d{6}/.test(code.value)) && code.value)) {
        // Adding Invalid Message
        addInvalidMessage(codeCont, 'Invalid Code', invalidCode);
        // Styling the Text Field
        code.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(code);
        // Setting the Flag
        invalidCode = true;
    }
    // Handling Invalid Password Structure
    if (!(sec.isSafePassword(password.value) && password.value)) {
        // Adding Invalid Message
        addInvalidMessage(passwordCont, 'Invalid Password', invalidPassword);
        // Styling the Text Field
        password.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(password);
        // Setting the Flag
        invalidPassword = true;
    }
    // Checking if Generated Code and Given Code Match
    if (code.value == generatedCode) {
        if (email.value == 'user@example.com') {
            const currentUser = JSON.parse(localStorage.getItem('RecipeHubUser'));
            const salt = sec.generatePasswordSalt();
            const hash = await sec.hashValue(password.value + salt);
            currentUser.password = hash;
            currentUser.salt = salt;
            localStorage.removeItem('RecipeHubUser');
            localStorage.setItem('RecipeHubUser', JSON.stringify(currentUser));
        } else if (email.value == 'admin@example.com') {
            const currentUser = JSON.parse(localStorage.getItem('RecipeHubAdmin'));
            const salt = sec.generatePasswordSalt();
            const hash = await sec.hashValue(password.value + salt);
            currentUser.password = hash;
            currentUser.salt = salt;
            localStorage.removeItem('RecipeHubAdmin');
            localStorage.setItem('RecipeHubAdmin', JSON.stringify(currentUser));
        }
        window.location.href = "../../../templates/accounts/login.html";
    } else {
        // Adding Invalid Message
        addInvalidMessage(codeCont, 'Invalid Code', invalidCode);
        // Styling the Text Field
        code.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(code);
        // Setting the Flag
        invalidCode = true;
    }
});

// Email Event Listener
email.addEventListener('input', function(event) {
    // Cheking for Invalid Email Structure
    if (invalidEmail) {
        // Removing the Invalid Message
        emailCont.removeChild(emailCont.lastChild);
        // Removing the Extra Styling
        email.style = "";
        // Restting the Flag
        invalidEmail = false;
    }
});

// Code Event Listener
code.addEventListener('input', function(event) {
    // Cheking for Invalid Code
    if (invalidCode) {
        // Removing the Invalid Message
        codeCont.removeChild(codeCont.lastChild);
        // Removing the Extra Styling
        code.style = "";
        // Restting the Flag
        invalidCode = false;
    }
});

// Password Event Listener
password.addEventListener('input', function(event) {
    // Cheking for Invalid Password
    if (invalidPassword) {
        // Removing the Invalid Message
        passwordCont.removeChild(passwordCont.lastChild);
        // Removing the Extra Styling
        password.style = "";
        // Restting the Flag
        invalidPassword = false;
    }
});

// Send Code Button Event Listener
codeBtn.addEventListener('click', function(event) {
    // Handle Empty Email
    if (!email.value || invalidEmail) {
        // Adding Invalid Message
        addInvalidMessage(emailCont, 'Enter Email First', invalidEmail);
        // Styling the Text Field
        email.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(email);
        // Setting the Flag
        invalidEmail = true;
        return;
    }
    // Generate Cryptographically Secure Random 6-digit Code
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    generatedCode = 100000 + (arr[0] % 900000);
    // Display Code to Console
    console.log(`Sent ${generatedCode} to ${email.value}`);
    // Disable Button for 60 Seconds
    codeBtn.disabled = true;
    codeBtn.classList.add("no-hover");
    setTimeout(() => {
        codeBtn.disabled = false;
    }, 60000);
    let remain = 60;
    codeBtn.textContent = `Wait ${remain}s...`;
    const timer = setInterval(() => {
        remain -= 1;
        codeBtn.textContent = `Wait ${remain}s...`;
        if (remain <= 0) {
            clearInterval(timer);
            codeBtn.textContent = "Send Code";
        }
    }, 1000);
    codeBtn.classList.remove("no-hover");
});