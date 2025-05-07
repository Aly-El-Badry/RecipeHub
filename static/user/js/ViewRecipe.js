///Parsing the data///
let recipe = JSON.parse(localStorage.getItem('currentRecipe'));

// Get the current user
let currentUser = JSON.parse(localStorage.getItem('RecipeHubUser'));

// Initialize favorites array in user data if it doesn't exist
if (!currentUser) {
    currentUser = { favorites: [] };
    localStorage.setItem('RecipeHubUser', JSON.stringify(currentUser));
} else if (!currentUser.favorites) {
    currentUser.favorites = [];
    localStorage.setItem('RecipeHubUser', JSON.stringify(currentUser));
}

// Get the favorite button element
const favoriteBtn = document.getElementById('favoriteBtn');
const favoriteIcon = favoriteBtn.querySelector('i');
const favoriteText = favoriteBtn.querySelector('span');

// Check if recipe is in favorites
const isFavorite = currentUser.favorites.some(fav => fav.id.toString() === recipe.id.toString());

// Update button state
if (isFavorite) {
    favoriteBtn.classList.add('active');
    favoriteIcon.classList.remove('far');
    favoriteIcon.classList.add('fas');
    favoriteText.textContent = 'Remove from Favorites';
} else {
    favoriteBtn.classList.remove('active');
    favoriteIcon.classList.remove('fas');
    favoriteIcon.classList.add('far');
    favoriteText.textContent = 'Add to Favorites';
}

// Add click event listener to favorite button
favoriteBtn.addEventListener('click', function() {
    const currentUser = JSON.parse(localStorage.getItem('RecipeHubUser'));
    const isFavorite = currentUser.favorites.some(fav => fav.id.toString() === recipe.id.toString());
    
    if (isFavorite) {
        // Remove from favorites
        currentUser.favorites = currentUser.favorites.filter(fav => fav.id.toString() !== recipe.id.toString());
        localStorage.setItem('RecipeHubUser', JSON.stringify(currentUser));
        favoriteBtn.classList.remove('active');
        favoriteIcon.classList.remove('fas');
        favoriteIcon.classList.add('far');
        favoriteText.textContent = 'Add to Favorites';
    } else {
        // Add to favorites
        currentUser.favorites.push(recipe);
        localStorage.setItem('RecipeHubUser', JSON.stringify(currentUser));
        favoriteBtn.classList.add('active');
        favoriteIcon.classList.remove('far');
        favoriteIcon.classList.add('fas');
        favoriteText.textContent = 'Remove from Favorites';
    }
});

// the required fields //
let title = recipe.name;
let time = recipe.time;
let quantities = recipe.quantity;
let Ingredients = recipe.ingredients;
let description = recipe.steps;
let crsName = recipe.courseType;
let foodtype = recipe.foodType;
let image = recipe.image;

// Update the recipe title and image
document.getElementById('recipeTitle').textContent = title;
document.getElementById('recipeImage').style.backgroundImage = `url('${image}')`;

// Update meta information
document.getElementById('Time').textContent += time + ' minutes';
document.getElementById('crs').textContent += crsName;

// Update food type
let foodTypeText = '';
if (Array.isArray(foodtype)) {
    foodTypeText = foodtype.join(', ');
} else {
    foodTypeText = foodtype;
}
document.getElementById('type').textContent += foodTypeText;

// Update ingredients
for (let idx = 0; idx < quantities.length; idx++) {
    let NewSection = document.createElement('li');
    NewSection.setAttribute('class', 'line');
    NewSection.textContent = quantities[idx] + ' ' + Ingredients[idx];
    document.getElementById('List').appendChild(NewSection);
}

// Update steps
for (let idx = 0; idx < description.length; idx++) {
    let NewSection = document.createElement('li');
    NewSection.setAttribute('class', 'line');
    NewSection.textContent = description[idx];
    document.getElementById('orderedList').appendChild(NewSection);
}

