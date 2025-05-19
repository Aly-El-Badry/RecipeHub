class Navbar {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.searchInput = document.querySelector('.search-input');
        this.init();
    }

    init() {
        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    toggleMenu() {
        this.menuToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        // You can implement your search logic here
        console.log('Searching for:', searchTerm);
    }

    handleOutsideClick(e) {
        if (!this.navMenu?.contains(e.target) && !this.menuToggle?.contains(e.target)) {
            this.menuToggle?.classList.remove('active');
            this.navMenu?.classList.remove('active');
        }
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.menuToggle?.classList.remove('active');
            this.navMenu?.classList.remove('active');
        }
    }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navbar = new Navbar();
}); 