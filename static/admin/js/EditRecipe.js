document.addEventListener('DOMContentLoaded', function() {
    const recipeSearch = document.getElementById('recipeSearch');
    const searchResults = document.getElementById('searchResults');
    const editForm = document.getElementById('editForm');
    const ingredientsContainer = document.getElementById('ingredientsContainer');
    const addIngredientBtn = document.getElementById('addIngredient');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    let currentRecipe = null;

    // Search functionality
    recipeSearch.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        const filteredRecipes = recipes.filter(recipe => 
            recipe.name.toLowerCase().includes(query) ||
            recipe.description.some(desc => desc.toLowerCase().includes(query))
        );

        displaySearchResults(filteredRecipes);
    });

    function displaySearchResults(recipes) {
        searchResults.innerHTML = '';
        if (recipes.length === 0) {
            searchResults.style.display = 'none';
            return;
        }

        recipes.forEach(recipe => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.name}">
                <div class="recipe-info">
                    <h4>${recipe.name}</h4>
                    <p>${recipe.description[0]}</p>
                </div>
            `;
            resultItem.addEventListener('click', () => loadRecipeForEditing(recipe));
            searchResults.appendChild(resultItem);
        });

        searchResults.style.display = 'block';
    }

    function loadRecipeForEditing(recipe) {
        currentRecipe = recipe;
        searchResults.style.display = 'none';
        editForm.classList.add('active');

        // Fill form with recipe data
        document.getElementById('recipeId').value = recipe.id;
        document.getElementById('recipeName').value = recipe.name;
        document.getElementById('courseType').value = recipe.courseType;
        document.getElementById('cookingTime').value = recipe.time;
        document.getElementById('foodType').value = recipe.foodType;
        document.getElementById('description').value = recipe.description.join('\n');

        // Load ingredients
        ingredientsContainer.innerHTML = '';
        recipe.ingredients.forEach((ingredient, index) => {
            addIngredientField(ingredient, recipe.quantity[index]);
        });
    }

    function addIngredientField(ingredient = '', quantity = '') {
        const ingredientDiv = document.createElement('div');
        ingredientDiv.className = 'ingredient-row';
        ingredientDiv.innerHTML = `
            <div class="form-row">
                <div class="form-col">
                    <div class="form-group">
                        <label class="tags">Ingredient Name</label>
                        <input type="text" class="inputLetters" name="ingredients[]" value="${ingredient}" required>
                    </div>
                </div>
                <div class="form-col">
                    <div class="form-group">
                        <label class="tags">Quantity</label>
                        <input type="text" class="input" name="quantity[]" value="${quantity}" required>
                    </div>
                </div>
            </div>
        `;
        ingredientsContainer.appendChild(ingredientDiv);
    }

    // Add ingredient button
    addIngredientBtn.addEventListener('click', () => addIngredientField());

    // Submit button
    submitBtn.addEventListener('click', function() {
        if (!currentRecipe) return;

        const formData = {
            id: currentRecipe.id,
            name: document.getElementById('recipeName').value,
            courseType: document.getElementById('courseType').value,
            time: parseInt(document.getElementById('cookingTime').value),
            foodType: document.getElementById('foodType').value,
            ingredients: Array.from(document.querySelectorAll('input[name="ingredients[]"]')).map(input => input.value),
            quantity: Array.from(document.querySelectorAll('input[name="quantity[]"]')).map(input => input.value),
            description: document.getElementById('description').value.split('\n').filter(step => step.trim()),
            image: currentRecipe.image // Keep the existing image
        };

        // Update recipe in local storage
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        const index = recipes.findIndex(r => r.id === currentRecipe.id);
        if (index !== -1) {
            recipes[index] = formData;
            localStorage.setItem('recipes', JSON.stringify(recipes));
            alert('Recipe updated successfully!');
            window.location.href = 'dashboard.html';
        }
    });

    // Cancel button
    cancelBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
            window.location.href = 'dashboard.html';
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!recipeSearch.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}); 