// Import Libraries
import * as sec from "../../components/js/security.js";

// Global Flags
let invalidEmail = false;
let invalidPassword = false;
let invalidCredentials = false;

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
// Make it fetch data if it is not exist only
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
async function validateCredentials(email, password) {
    // Getting the Data From the Local Storage
    let credentials = JSON.parse(localStorage.getItem('RecipeHubUser'));
    if (credentials == null) {
        credentials = JSON.parse(localStorage.getItem('RecipeHubAdmin'));
    }
    // Hashing the Given Password with the Stored Salt
    const hash = await sec.hashValue(password + credentials.salt);
    // Comparing Credentials
    if (email === credentials.email && hash === credentials.password) {
        return credentials;
    } else {
        return null
    }
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
    // Handling Invalid Password Structure
    if (!(sec.isSafePassword(password.value) && password.value)) {
        // Adding Invalid Message
        addInvalidMessage(passCont, 'Invalid Password', invalidPassword);
        // Styling the Text Field
        password.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Field
        shake(password);
        // Setting the Flag
        invalidPassword = true;
    }
    if (invalidEmail || invalidPassword) {return;}
    // Handling Credentials Correctness
    const serverResponse = await validateCredentials(email.value, password.value);
    // Correct Crendetials
    if (serverResponse === null) {
        // Adding Invalid Message
        addInvalidMessage(submitCont, "Invalid Email or Password", invalidCredentials);
        // Styling the Text Fields
        email.style = TEXT_FIELD_ERROR_STYLE;
        password.style = TEXT_FIELD_ERROR_STYLE;
        // Shaking the Text Fields
        shake(email);
        shake(password);
        // Setting the Flag
        invalidCredentials = true;
    } else {
        // Set Current User in Session Storage
        delete serverResponse.password;
        delete serverResponse.salt;
        localStorage.setItem('currentUser', JSON.stringify(serverResponse));
        if (serverResponse.type == 'admin') {
            window.location.href = "../../../templates/admin/dashboard.html";
        } else {
            window.location.href = "../../../templates/user/dashboard.html";
        }
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
    // Handling Invalid Credentials
    if (invalidCredentials) {
        email.style = "";
        password.style = "";
        submitCont.removeChild(submitCont.lastChild);
        invalidCredentials = false;
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
    // Handling Invalid Credentials
    if (invalidCredentials) {
        password.style = "";
        email.style = "";
        submitCont.removeChild(submitCont.lastChild);
        invalidCredentials = false;
    }
});
