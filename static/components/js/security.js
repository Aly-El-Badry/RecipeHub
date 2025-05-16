// Check for SQL Injection in Email
function isSafeEmail(text) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

// Check for SQL Injection in Password
function isSafePassword(text) {
    return /^[a-zA-Z0-9!@#$%^&*()_+-=[\]{};':"\\|,.<>/?]*$/.test(text);
}

// Check for SQL Injection in General
function isSafeText(text) {
    return /^[a-zA-Z0-9\s.,!?-]*$/.test(text);
}

// Generate Password Salt for SHA-256 Hashing
function generatePasswordSalt() {
    // Create a 16 Byte Integer Array
    const arr = new Uint8Array(16);
    // Fill with Cryptographically Secure Random Numbers
    crypto.getRandomValues(arr);
    // Convert to Base64 and Return the Salt
    return btoa(String.fromCharCode(...arr));
}

// SHA-256 Hashing Function
async function SHA256Hasher(data) {
    // Create Text Encoder
    const encoder = new TextEncoder();
    // Encoding the Data
    data = encoder.encode(data);
    // Hashing the Data with SHA-256
    const buffer = await crypto.subtle.digest('SHA-256', data);
    // Converting the Hash to Integer Array
    const hash = Array.from(new Uint8Array(buffer));
    // Returning the Hash Array
    return hash.map(x => x.toString(16).padStart(2, '0')).join('');
}

// Hash Given Value Using SHA-256
async function hashValue(data, salt = "") {
    // Generate Password Salt
    if (salt == "") {
        const salt = generatePasswordSalt();
    }
    // Hash the Data with SHA-256
    const hash = await SHA256Hasher(data + salt);
    // Return the Hashed Value
    return hash;
}