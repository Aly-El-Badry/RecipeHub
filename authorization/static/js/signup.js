// Global Flags
let invalidFirstName = false;
let invalidLastName = false;
let invalidUsername = false;
let invalidEmail = false;
let invalidPassword = false;
let invalidConfirmPassword = false;
let invalidBirthDate = false;
let invalidTerms = false;
let invalidType = false;

// Constants
const TEXT_FIELD_ERROR_STYLE = "box-shadow: 0 0 10px 1px red;";
const ERROR_MESSSAGE_STYLE = "color: red; font-size: smaller; font-weight: bold; padding: 0 0.5rem; margin: 0;";

// DOM Elements
const form = document.getElementById("form");
const firstName = document.getElementById("FirstName");
const firstNameCont = document.getElementById("firstNameCont");
const lastName = document.getElementById("LastName");
const lastNameCont = document.getElementById("lastNameCont");
const username = document.getElementById("username");
const usernameCont = document.getElementById("usernameCont");
const email =  document.getElementById("email");
const emailCont = document.getElementById("emailCont");
const password = document.getElementById("password");
const passwordCont = document.getElementById("passwordCont");
const confirmPass = document.getElementById("confirmPassword");
const confirmPassCont = document.getElementById("confirmPassCont");
const birthDate = document.getElementById("birthDate");
const birthDateCont = document.getElementById("birthDateCont");
const typeRadio = document.querySelectorAll('input[name="accType"]');
const typeCont = document.getElementById("typeCont");
const terms = document.getElementById("terms");
const termsCont = document.getElementById("termsCont");

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

// Get Selected User Type
function getSelectedUserType() {
    const selected = document.querySelector('input[name="accType"]:checked');
    // Check if Non is Selected
    if (!selected) {
        return null;
    }
    return selected.value;
}

// Form Event Listener
form.addEventListener('submit', async function(event) {
    let isValid = true;
    // Checking Checkbox Selection
    if (!terms.checked) {
        // Styling The Text
        termsCont.style = TEXT_FIELD_ERROR_STYLE;
        // Setting the Flag
        invalidTerms = true;
        isValid = false;
    }
    // Checking if Password and Confirm Password Match
    if (password.value != confirmPass.value) {
        // Adding Invalid Message
        addInvalidMessage(confirmPassCont, 'Passwords Don\'t Match', invalidConfirmPassword);
        // Styling the Text Field
        confirmPass.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(confirmPass);
        // Setting the Flag
        invalidConfirmPassword = true;
        isValid = false;
    }
    if (!isValid) {
        event.preventDefault();
    }
});

// First Name Event Listener
firstName.addEventListener('input', function(event) {
    // Cheking for Invalid First Name
    if (invalidFirstName) {
        // Removing the Invalid Message
        firstNameCont.removeChild(firstNameCont.lastChild);
        // Removing the Extra Styling
        firstName.style = "";
        // Restting the Flag
        invalidFirstName = false;
    }
});

// Last Name Event Listener
lastName.addEventListener('input', function(event) {
    // Cheking for Invalid Last Name
    if (invalidLastName) {
        // Removing the Invalid Message
        lastNameCont.removeChild(lastNameCont.lastChild);
        // Removing the Extra Styling
        lastName.style = "";
        // Restting the Flag
        invalidLastName = false;
    }
});

// Username Event Listener
username.addEventListener('input', function(event) {
    // Cheking for Invalid Username
    if (invalidUsername) {
        // Removing the Invalid Message
        usernameCont.removeChild(usernameCont.lastChild);
        // Removing the Extra Styling
        username.style = "";
        // Restting the Flag
        invalidUsername = false;
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
        passwordCont.removeChild(passwordCont.lastChild);
        // Removing the Extra Styling
        password.style = "";
        // Restting the Flag
        invalidPassword = false;
    }
});

// Confirm Password Event Listener
confirmPass.addEventListener('input', function(event) {
    // Cheking for Invalid Password
    if (invalidConfirmPassword) {
        // Removing the Invalid Message
        confirmPassCont.removeChild(confirmPassCont.lastChild);
        // Removing the Extra Styling
        confirmPass.style = "";
        // Restting the Flag
        invalidConfirmPassword = false;
    }
});

// Birth Date Event Listener
birthDate.addEventListener('input', function(event) {
    // Cheking for Invalid Password
    if (invalidBirthDate) {
        // Removing the Invalid Message
        birthDateCont.removeChild(birthDateCont.lastChild);
        // Removing the Extra Styling
        birthDate.style = "";
        // Restting the Flag
        invalidBirthDate = false;
    }
});

// Radio Event Listener
typeRadio.forEach(radio => {
    radio.addEventListener('change', function() {
        // Checking for Selecting
        if (this.checked) {
            // Removing the Extra Styling
            typeCont.style = "";
            invalidType = false;
        }
    });
});

// Terms Event Listener
terms.addEventListener('change', function(event) {
    // Cheking for Selecting
    if (terms.checked) {
        // Removing the Extra Styling
        termsCont.style = "";
        invalidTerms = false;
    }
});