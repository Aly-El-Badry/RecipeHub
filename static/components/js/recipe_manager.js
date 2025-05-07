export function deleteRecipe(id) {
    let recipes = JSON.parse(localStorage.getItem("recipes"));
    let idx = recipes.findIndex(recipe => recipe.id === id);
    if (idx === -1) {
        console.error("Recipe not found");
        return;
    }
    recipes.splice(idx, 1);
    localStorage.setItem("recipes", JSON.stringify(recipes));
}

export function addRecipe(obj) {
    let arr = JSON.parse(localStorage.getItem("recipes"));
    let lastId = arr.length > 0 ? arr[arr.length - 1].id : -1;;
    obj.id = lastId + 1;
    arr.push(obj);
    localStorage.setItem("recipes", JSON.stringify(recipes));
}

export function initializeSearch(query) {
    const recipeData = JSON.parse(localStorage.getItem("recipes"));
    const searchInput = query;
    const searchResultsDropdown = document.querySelector('.search-results-dropdown');

    if (searchInput && searchResultsDropdown) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();

            if (query) {
                const searchResults = recipeData.filter(recipe => 
                    recipe.name.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 3);

                searchResultsDropdown.innerHTML = '';
                if (searchResults.length > 0) {
                    searchResults.forEach(recipe => {
                        const resultItem = document.createElement('div');
                        resultItem.classList.add('search-result-item');
                        resultItem.innerHTML = `
                            <img src="${recipe.image}" alt="${recipe.name}">
                            <div class="recipe-info">
                                <h4>${recipe.name}</h4>
                            </div>
                        `;
                        resultItem.addEventListener('click', function() {
                            localStorage.setItem('currentRecipe', JSON.stringify(recipe));
                            window.location.href = 'ViewRecipe.html';
                        });
                        searchResultsDropdown.appendChild(resultItem);
                    });
                    searchResultsDropdown.classList.add('active');
                } else {
                    searchResultsDropdown.classList.remove('active');
                }
            } else {
                searchResultsDropdown.classList.remove('active');
            }
        });
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResultsDropdown.contains(e.target)) {
                searchResultsDropdown.classList.remove('active');
            }
        });
    }
}