document.addEventListener('DOMContentLoaded', function() {
    // Toggle mobile menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Form validation
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            const reportType = document.querySelector('select[name="report_type"]');
            const description = document.querySelector('textarea[name="description"]');
            
            if (reportType.value === '') {
                e.preventDefault();
                alert('Please select a report type');
                reportType.focus();
                return;
            }
            
            if (description.value.trim() === '') {
                e.preventDefault();
                alert('Please provide a description');
                description.focus();
                return;
            }
        });
    }
}); 