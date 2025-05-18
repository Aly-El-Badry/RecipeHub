// Get the favorite button element
const favoriteBtn = document.getElementById('favoriteBtn');
const favoriteIcon = favoriteBtn.querySelector('i');
const favoriteText = favoriteBtn.querySelector('span');

// Add click event listener to favorite button
favoriteBtn.addEventListener('click', function() {
    const isFavorite = currentUser.favorites.some(fav => fav.id.toString() === recipe.id.toString());
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

