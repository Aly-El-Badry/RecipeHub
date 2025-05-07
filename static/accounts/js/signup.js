// Import Libraries
import * as sec from "../../components/js/security.js";

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

// Validate Credentials with Server
async function sendCredentials() {
    // Encoding the Password
    const salt = sec.generatePasswordSalt();
    const hash = await sec.hashValue(password.value + salt);
    console.log("+===    Simulating Contacting the Server    ===+");
    let userCredentials = {
        'username': username.value,
        'firstName': firstName.value,
        'lastName': lastName.value,
        'email': email.value,
        'password': hash,
        'birthDate': birthDate.value,
        'type': getSelectedUserType(),
        'salt': salt,
    };
    console.log(userCredentials);
    
    // Clear any existing user data
    localStorage.removeItem('RecipeHubUser');
    localStorage.removeItem('RecipeHubAdmin');
    
    if (getSelectedUserType() == 'user') {
        localStorage.setItem('RecipeHubUser', JSON.stringify(userCredentials));
        console.log('saved user');
        return 1;
    } else {
        localStorage.setItem('RecipeHubAdmin', JSON.stringify(userCredentials));
        console.log('saved admin');
        return 2;
    }
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
    // Handling Invalid First Name Stucture
    if (!(sec.isSafeText(firstName.value) && firstName.value)) {
        // Adding Invalid Message
        addInvalidMessage(firstNameCont, 'Invalid First Name', invalidFirstName);
        // Styling the Text Field
        firstName.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(firstName);
        // Setting the Flag
        invalidFirstName = true;
    }
    // Handling Invalid Last Name Stucture
    if (!(sec.isSafeText(lastName.value) && lastName.value)) {
        // Adding Invalid Message
        addInvalidMessage(lastNameCont, 'Invalid Last Name', invalidLastName);
        // Styling the Text Field
        lastName.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(lastName);
        // Setting the Flag
        invalidLastName = true;
    }
    // Handling Invalid Username Stucture
    if (!(sec.isSafeText(username.value) && username.value)) {
        // Adding Invalid Message
        addInvalidMessage(usernameCont, 'Invalid Username', invalidUsername);
        // Styling the Text Field
        username.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(username);
        // Setting the Flag
        invalidUsername = true;
    }
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
    // Handling Invalid Confirm Password Structure
    if (!(sec.isSafePassword(confirmPass.value) && confirmPass.value)) {
        // Adding Invalid Message
        addInvalidMessage(confirmPassCont, 'Invalid Password', invalidConfirmPassword);
        // Styling the Text Field
        confirmPass.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(confirmPass);
        // Setting the Flag
        invalidConfirmPassword = true;
    }
    // Handling Invalid Date of Birth Structure
    if (!birthDate.value) {
        // Adding Invalid Message
        addInvalidMessage(birthDateCont, 'Invalid Date of Birth', invalidBirthDate);
        // Styling the Text Field
        birthDate.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(birthDate);
        // Setting the Flag
        invalidBirthDate = true;
    }
    // Checking Type Selection
    if (!getSelectedUserType()) {
        // Styling The Text
        typeCont.style = TEXT_FIELD_ERROR_STYLE;
        invalidType = true;
    }
    // Checking Checkbox Selection
    if (!terms.checked) {
        // Styling The Text
        termsCont.style = TEXT_FIELD_ERROR_STYLE;
        // Setting the Flag
        invalidTerms = true;
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
    }
    if (invalidFirstName || invalidLastName || invalidUsername || invalidEmail || invalidPassword || invalidConfirmPassword || invalidBirthDate || invalidType || invalidTerms) {return;}
    const responseCode = await sendCredentials();
    if (responseCode == 1) {
        // Set Current User in Session Storage
        const currentUser = JSON.parse(localStorage.getItem('RecipeHubUser'));
        delete currentUser.password;
        delete currentUser.salt;
        localStorage.setItem('RecipeHubUser', JSON.stringify(currentUser));
        window.location.href = "../../../templates/user/dashboard.html";
    } else if (responseCode == 2) {
        // Set Current User in Session Storage
        const currentUser = JSON.parse(localStorage.getItem('RecipeHubAdmin'));
        delete currentUser.password;
        delete currentUser.salt;
        localStorage.setItem('RecipeHubAdmin', JSON.stringify(currentUser));
        window.location.href = "../../../templates/admin/dashboard.html";
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