document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const sidebarFilterTitle = document.querySelector('.Filter-title');
    const sidebarFilterSection = document.querySelectorAll('.sidebar-section');
    const sidebarFilterSubTitle = document.querySelectorAll('.filter-sub-title');
    const sidebar = document.querySelector('.sidebar');

    // Menu toggle functionality
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Sidebar filter title toggle
    if (sidebarFilterTitle) {
        sidebarFilterTitle.addEventListener('click', function(){
            sidebarFilterSection.forEach(section => {
                section.classList.toggle('active');
            });
        });
    }

    // Sidebar filter subtitle toggle
    if (sidebarFilterSubTitle) {
        sidebarFilterSubTitle.forEach(title => {
            title.addEventListener('click', function(){
                const nextElement = title.nextElementSibling;
                if(nextElement && nextElement.classList.contains('active')){
                    nextElement.classList.remove('active');
                }
                else if(nextElement) {
                    nextElement.classList.add('active');
                }
            });
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && sidebar) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnMenuToggle = menuToggle && menuToggle.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnMenuToggle && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                menuToggle && menuToggle.classList.remove('active');
            }
        }
    });
}); 