// Check for safe text (letters, numbers, spaces, basic punctuation)
function isSafeText(text) {
    return /^[a-zA-Z0-9\s.,!?-]*$/.test(text);
}

// Check for valid email format
function isSafeEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Function to get reports from localStorage
function getStoredReports() {
    const reports = localStorage.getItem('reports');
    return reports ? JSON.parse(reports) : [];
}

// Function to save reports to localStorage
function saveReport(report) {
    const reports = getStoredReports();
    reports.push({
        ...report,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('reports', JSON.stringify(reports));
}

document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const description = document.getElementById('description').value;
    const email = document.getElementById('email').value;
    
    // Validate required fields
    if (!description) {
        alert('Please provide a description of the problem.');
        return;
    }
    
    // Validate description content
    if (!isSafeText(description)) {
        alert('Description contains invalid characters. Please only use letters, numbers, spaces, and basic punctuation.');
        return;
    }
    
    // Validate email if provided
    if (email && !isSafeEmail(email)) {
        alert('Please enter a valid email address (e.g., user@example.com).');
        return;
    }
    
    const formData = {
        reportType: document.getElementById('reportType').value,
        description: description,
        email: email
    };

    // Save to localStorage
    saveReport(formData);
    
    // Hide the form
    document.getElementById('reportForm').style.display = 'none';
    
    // Create or show confirmation message
    let confirmation = document.getElementById('confirmation');
    if (!confirmation) {
        confirmation = document.createElement('div');
        confirmation.id = 'confirmation';
        confirmation.innerHTML = `
            <h2>Thank You!</h2>
            <p>Your report has been submitted successfully.</p>
            <p>We will review it and take appropriate action.</p>
        `;
        document.querySelector('.ReportBox').appendChild(confirmation);
    } else {
        confirmation.style.display = 'block';
    }
    
    console.log('Form data:', formData);
    console.log('All reports:', getStoredReports());
});
