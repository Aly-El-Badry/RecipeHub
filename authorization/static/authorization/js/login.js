// Global Flags
let invalidEmail = false;
let invalidPassword = false;

// Constants
const TEXT_FIELD_ERROR_STYLE = "box-shadow: 0 0 10px 1px red;";
const ERROR_MESSSAGE_STYLE = "color: red; font-size: smaller; font-weight: bold; padding: 0 0.5rem; margin: 0.25rem 0;";

// DOM Elements
const form = document.getElementById("formElement");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passCont = document.getElementById("passwordContainer");
const emailCont = document.getElementById("emailContainer");
const submitCont = document.getElementById("submitContainer");

// Validate Email Format
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

// Form Event Listener
form.addEventListener('submit', function(event) {
    // Handling Invalid Email Stucture
    if (!email.value) {
        // Adding Invalid Message
        addInvalidMessage(emailCont, 'Invalid Email', invalidEmail);
        // Styling the Text Field
        email.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(email);
        // Setting the Flag
        invalidEmail = true;
    } else if (!isValidEmail(email.value)) {
        showError(emailCont, 'Invalid email format');
        email.style = TEXT_FIELD_ERROR_STYLE;
        shake(email);
        invalidEmail = true;
    }
    // Handling Invalid Password Structure
    if (!password.value) {
        // Adding Invalid Message
        addInvalidMessage(passCont, 'Invalid Password', invalidPassword);
        // Styling the Text Field
        password.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(password);
        // Setting the Flag
        invalidPassword = true;
    }
    if (invalidEmail || invalidPassword) {
        event.preventDefault();
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

// Password Event Listener
password.addEventListener('input', function(event) {
    // Cheking for Invalid Password
    if (invalidPassword) {
        // Removing the Invalid Message
        passCont.removeChild(passCont.lastChild);
        // Removing the Extra Styling
        password.style = "";
        // Restting the Flag
        invalidPassword = false;
    }
});
