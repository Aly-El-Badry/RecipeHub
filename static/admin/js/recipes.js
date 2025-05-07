// Initialize recipes from local storage or use default sample data
let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

// Function to load recipes from Data.json
async function loadRecipes() {
    try {
        const response = await fetch('../../static/user/js/Data.json');
        const data = await response.json();
        recipes = data;
        saveRecipesToLocalStorage();
        displayRecipes();
    } catch (error) {
        console.error('Error loading recipes:', error);
    }
}

// Save recipes to local storage
function saveRecipesToLocalStorage() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Function to create a recipe card
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    const difficultyClass = `difficulty-${recipe.foodType.toLowerCase()}`;
    
    card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
        <div class="recipe-content">
            <h3 class="recipe-title">${recipe.name}</h3>
            <div class="recipe-meta">
                <span><i class="fas fa-clock"></i> ${recipe.time} min</span>
                <span><i class="fas fa-utensils"></i> ${recipe.courseType}</span>
                <span class="difficulty-badge ${difficultyClass}">${recipe.foodType || 'All'}</span>
            </div>
            <p class="recipe-description">${recipe.steps[0]}</p>
            <div class="recipe-actions">
                <button class="edit-button" onclick="editRecipe(${recipe.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-button" onclick="deleteRecipe(${recipe.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Function to display recipes
function displayRecipes(filteredRecipes = recipes) {
    const recipesGrid = document.getElementById('recipes-grid');
    recipesGrid.innerHTML = '';
    
    filteredRecipes.forEach(recipe => {
        const card = createRecipeCard(recipe);
        recipesGrid.appendChild(card);
    });
}

// Function to filter recipes
function filterRecipes() {
    const categoryFilter = document.getElementById('category-filter').value;
    const difficultyFilter = document.getElementById('difficulty-filter').value;
    const timeFilter = document.getElementById('time-filter').value;
    
    let filteredRecipes = recipes;
    
    if (categoryFilter !== 'all') {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.courseType.toLowerCase() === categoryFilter);
    }
    
    if (difficultyFilter !== 'all') {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.foodType.toLowerCase() === difficultyFilter);
    }
    
    if (timeFilter !== 'all') {
        const timeRanges = {
            'quick': time => time <= 30,
            'medium': time => time > 30 && time <= 60,
            'long': time => time > 60
        };
        filteredRecipes = filteredRecipes.filter(recipe => timeRanges[timeFilter](parseInt(recipe.time)));
    }
    
    displayRecipes(filteredRecipes);
}

// Function to handle search
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredRecipes = recipes.filter(recipe => 
            recipe.name.toLowerCase().includes(searchTerm) ||
            recipe.courseType.toLowerCase().includes(searchTerm) ||
            recipe.foodType.toLowerCase().includes(searchTerm)
        );
        displayRecipes(filteredRecipes);
    });
}

// Function to edit recipe
function editRecipe(id) {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
        window.location.href = `Edit-Recipe.html?id=${id}`;
    }
}

// Function to delete recipe
function deleteRecipe(id) {
    if (confirm('Are you sure you want to delete this recipe?')) {
        const index = recipes.findIndex(r => r.id === id);
        if (index !== -1) {
            recipes.splice(index, 1);
            saveRecipesToLocalStorage();
            displayRecipes();
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load recipes from Data.json
    loadRecipes();
    
    // Add event listeners to filters
    document.getElementById('category-filter').addEventListener('change', filterRecipes);
    document.getElementById('difficulty-filter').addEventListener('change', filterRecipes);
    document.getElementById('time-filter').addEventListener('change', filterRecipes);
    
    // Initialize search
    handleSearch();
}); 