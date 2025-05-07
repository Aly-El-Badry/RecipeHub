import * as man from "../../components/js/recipe_manager.js";

document.addEventListener('DOMContentLoaded', async function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sidebarMenu = document.querySelectorAll('.sidebar-menu');
    const sidebarFilterTitle = document.querySelector('.Filter-title');
    const sidebarFilterSection = document.querySelectorAll('.sidebar-section');
    const sidebarFilterSubTitle = document.querySelectorAll('.filter-sub-title');
    const sidebar = document.querySelector('.sidebar');
    const searchInput = document.querySelector('.search-input');
    const searchResultsDropdown = document.querySelector('.search-results-dropdown');
    const recipeGrid = document.querySelector('.recipe-grid');

    var filterationData = {
        "FoodType" : [],
        "sidebarFoodType" : [],
        "ingredients" : [],
        "searchQuery": ""
    };

    // Initialize data
    let Data = [];
    try {
        const storedData = localStorage.getItem('recipes');
        if (storedData) {
            Data = JSON.parse(storedData);
        } else {
            console.warn('No recipe data found in localStorage');
            recipeGrid.innerHTML = '<p class="no-recipes">No recipes available. Please add some recipes first.</p>';
        }
    } catch (error) {
        console.error('Error loading recipe data:', error);
        recipeGrid.innerHTML = '<p class="error-message">Error loading recipes. Please try again later.</p>';
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    function addingRecipes(){
        if (!recipeGrid) return;
        
        // Show loading state
        recipeGrid.innerHTML = '<div class="loading">Loading recipes...</div>';
        
        const filteredData = Data.filter(recipe => {
            // Search filter
            if (filterationData.searchQuery) {
                const searchLower = filterationData.searchQuery.toLowerCase();
                if (!recipe.name.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }
            // FoodType filter (top bar)
            if (filterationData.FoodType.length > 0) {
                if (!recipe.foodType || !filterationData.FoodType.some(filterValue => recipe.foodType.includes(filterValue))) {
                    return false;
                }
            }
            // Sidebar FoodType filter
            if (filterationData.sidebarFoodType.length > 0) {
                if (!recipe.foodType || !filterationData.sidebarFoodType.some(filterValue => recipe.foodType.includes(filterValue))) {
                    return false;
                }
            }
            // Ingredients filter (sidebar gradient)
            if (filterationData.ingredients.length > 0) {
                if (!recipe.ingredients || !filterationData.ingredients.some(filterValue => 
                    recipe.ingredients.some(ing => ing.name === filterValue))) {
                    return false;
                }
            }
            return true;
        });

        // Only limit to 3 recipes if there's a search query
        const displayData = filterationData.searchQuery ? filteredData.slice(0, 3) : filteredData;

        if (displayData.length === 0) {
            recipeGrid.innerHTML = '<p class="no-recipes">No recipes match your filters. Try adjusting your search criteria.</p>';
            return;
        }

        recipeGrid.innerHTML = '';
        displayData.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <img src="${recipe.image || 'static/user/images/default-recipe.jpg'}" alt="${recipe.name}">
                <div class="recipe-card-content">
                    <div class="recipe-meta">
                        <span><i class="fas fa-clock"></i> ${recipe.time || 'N/A'} min</span>
                    </div>
                    <h4>${recipe.name}</h4>
                    <p>${recipe.description?.[0] || 'No description available'}</p>
                    <a href="ViewRecipe.html" target="_blank"><button class="btn-primary">View Recipe</button></a>
                </div>
            `;
            recipeGrid.appendChild(recipeCard);
            
            // Add click event listener to the 'View Recipe' button
            const viewButton = recipeCard.querySelector('.btn-primary');
            viewButton.addEventListener('click', function() {
                localStorage.setItem('currentRecipe', JSON.stringify(recipe));
            });
        });
    }
    
    function handleFilterClick(e) {
        if(e.target.classList.contains('all-recipes')){
            filterButtons.forEach(button => button.classList.remove('active'));
            e.target.classList.add('active');
            filterationData.FoodType = [];
        }
        else if(e.target.classList.contains('active')){
            const activeButtons = document.querySelectorAll('.filter-btn.active');
            if(activeButtons.length > 1){
                e.target.classList.remove('active');
                const filterValue = e.target.textContent.trim();
                filterationData.FoodType = filterationData.FoodType.filter(value => value !== filterValue);
            }
            
        }
        else{
            e.target.classList.add('active');
            filterButtons.forEach(button => {
                if(button.classList.contains('all-recipes')){
                    button.classList.remove('active');
                }
            });
            const filterValue = e.target.textContent.trim();
            if(!filterationData.FoodType.includes(filterValue)){
                filterationData.FoodType.push(filterValue);
            }
        }
        addingRecipes();
    }
    
    function handleSidebarFilterClick(e, buttonsOfsidebar){
        if(e.target.classList.contains('all-recipes')){
            buttonsOfsidebar.forEach(button => button.classList.remove('active'));
            e.target.classList.add('active');
            
            if(e.target.parentElement.classList.contains('gradient-list')){
                filterationData.ingredients = [];
            }
            else{
                filterationData.sidebarFoodType = [];
            }
        }
        else if(e.target.classList.contains('active')){
            const activeButtons = buttonsOfsidebar.length ? buttonsOfsidebar[0].parentElement.querySelectorAll('.filter-btn-sidebar.active') : [];
            if(activeButtons.length > 1){
                e.target.classList.remove('active');
                const filterValue = e.target.textContent.trim();
                if(e.target.parentElement.classList.contains('gradient-list')){
                    filterationData.ingredients = filterationData.ingredients.filter(value => value !== filterValue);
                }
                else{
                    filterationData.sidebarFoodType = filterationData.sidebarFoodType.filter(value => value !== filterValue);
                }
            }
        }
        else{
            e.target.classList.add('active');
            buttonsOfsidebar.forEach(button => {
                if(button.classList.contains('all-recipes')){
                    button.classList.remove('active');
                }
            });
            const filterValue = e.target.textContent.trim();
            if(e.target.parentElement.classList.contains('gradient-list')){
                if(!filterationData.ingredients.includes(filterValue)){
                    filterationData.ingredients.push(filterValue);
                }
            }
            else{
                if(!filterationData.sidebarFoodType.includes(filterValue)){
                    filterationData.sidebarFoodType.push(filterValue);
                }
            }
        }
        addingRecipes();
    }


    // // Add search input event listener
    if (searchInput) {
        man.initializeSearch(searchInput);
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });
    
    sidebarMenu.forEach(menu => {
        let buttonsOfsidebar = menu.querySelectorAll('.filter-btn-sidebar');
        buttonsOfsidebar.forEach(button => {
            button.addEventListener('click', function(e) {
                handleSidebarFilterClick(e, buttonsOfsidebar);
            });
        });
    });

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

    if (sidebarFilterTitle) {
        sidebarFilterTitle.addEventListener('click', function(){
            sidebarFilterSection.forEach(section => {
                section.classList.toggle('active');
            });
        });
    }

    if (window.innerWidth <= 768) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Scroll the button into view
                this.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
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
    
    // Close nav menu when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const isClickInsideNavMenu = navMenu.contains(event.target);
            const isClickOnMenuToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideNavMenu && !isClickOnMenuToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });

    // Call addingRecipes initially to display data
    addingRecipes();
}); 