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

// Check for SQL Injection in Password
function isSafePassword(text) {
    return /^[a-zA-Z0-9!@#$%^&*()_+-=[\]{};':"\\|,.<>/?]*$/.test(text);
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
form.addEventListener('submit', async function(event) {
    // Handling Invalid Email Stucture
    if (!emailInput.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
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
    if (!codeInput.value || !/^[A-Za-z0-9]{6}$/.test(codeInput.value)) {
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
    if (!(isSafePassword(password.value) && password.value)) {
        // Adding Invalid Message
        addInvalidMessage(passwordCont, 'Invalid Password', invalidPassword);
        // Styling the Text Field
        password.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(password);
        // Setting the Flag
        invalidPassword = true;
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
codeBtn.addEventListener('click', async function(event) {
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

    try {
        const response = await fetch('/api/send-reset-code/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({email: email.value})
        });
        const data = await response.json();
        if (response.ok) {
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
        }  else {
            addInvalidMessage(emailCont, data.message || 'Failed to send code', invalidCode);
            codeBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        codeBtn.disabled = false;
    }
});