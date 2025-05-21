document.addEventListener('DOMContentLoaded', function() {
    const cancelBtn = document.querySelector('.cancel-btn');
    
    // Cancel button functionality
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
                window.location.href = '/dashboard/';
            }
        });
    }
});

