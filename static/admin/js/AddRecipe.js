document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.FORM');
    const addIngredientBtn = document.getElementById('add');
    const cancelBtn = document.getElementById('cancelBtn');
    const ingredientsContainer = document.getElementById('Ingredients');
    let ingredientCount = 1;

    // Add new ingredient fields
    addIngredientBtn.addEventListener('click', function() {
        const newIngredientSection = document.createElement('div');
        newIngredientSection.classList.add('IngredientContainer_1');
        newIngredientSection.innerHTML = `
            <div class="form-row">
                <div class="form-col">
                    <div class="form-group">
                        <label class="tags">Ingredient Name</label>
                        <input type="text" class="inputLetters" name="ingredients[]" placeholder="Enter ingredient name" required>
                    </div>
                </div>
                <div class="form-col">
                    <div class="form-group">
                        <label class="tags">Quantity</label>
                        <input type="text" class="input" name="quantity[]" placeholder="e.g., 2 cups, 500g" required>
                    </div>
                </div>
            </div>
        `;
        ingredientsContainer.appendChild(newIngredientSection);
        ingredientCount++;
    });

    // Cancel button functionality
    cancelBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
            window.location.href = 'dashboard.html';
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '';
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields');
            return;
        }

        // Generate a unique ID
        const recipeId = Date.now();

        // Collect form data
        const formData = {
            id: recipeId,
            name: form.querySelector('input[name="name"]').value,
            courseType: form.querySelector('select[name="courseType"]').value,
            time: parseInt(form.querySelector('input[name="time"]').value),
            foodType: form.querySelector('input[name="foodType"]').value,
            ingredients: Array.from(form.querySelectorAll('input[name="ingredients[]"]')).map(input => input.value),
            quantity: Array.from(form.querySelectorAll('input[name="quantity[]"]')).map(input => input.value),
            description: form.querySelector('textarea[name="description"]').value.split('\n').filter(step => step.trim()),
            image: form.querySelector('input[name="image"]').files[0]
        };

        // Handle local storage
        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        
        // Check if recipe with same name exists
        const existingRecipeIndex = recipes.findIndex(recipe => recipe.name === formData.name);
        
        if (existingRecipeIndex !== -1) {
            // Update existing recipe
            recipes[existingRecipeIndex] = formData;
        } else {
            // Add new recipe
            recipes.push(formData);
        }
        
        // Save to local storage
        localStorage.setItem('recipes', JSON.stringify(recipes));
        
        // Show success message
        alert('Recipe saved successfully!');
        window.location.href = 'dashboard.html';
    });
});

