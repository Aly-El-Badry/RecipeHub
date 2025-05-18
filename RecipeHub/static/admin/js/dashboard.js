// Check for SQL Injection 
function isSafeText(text)
{
    return /^[a-zA-Z0-9\s.,!?-]*$/.test(text);
}
    
// Function to load recipes from Data.json
async function loadRecipes()
{
    try
    {
        const response = await fetch('/recipe/api/recipes/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    }
    catch (error)
    {
        console.error('Error loading recipes:', error);
        return [];
    }
}

// Function to update statistics
async function updateStatistics()
{
    const recipes = await loadRecipes();
    
    // Update total recipes count
    const totalRecipesElement = document.querySelector('.statCard:nth-child(1) h3');
    if (totalRecipesElement)
    {
        totalRecipesElement.textContent = recipes.length;
    }

    // Update categories count
    const categories = new Set(recipes.map(recipe => recipe.courseType));
    const categoriesElement = document.querySelector('.statCard:nth-child(3) h3');
    if (categoriesElement)
    {
        categoriesElement.textContent = categories.size;
    }

    // Update recent activity
    updateRecentActivity(recipes);
}

// Function to update recent activity
function updateRecentActivity(recipes)
{
    const activityCard = document.querySelector('.activityCard');
    if (!activityCard) return;

    // Sort recipes by ID (assuming higher ID means more recent)
    const recentRecipes = [...recipes].sort((a, b) => b.id - a.id).slice(0, 3);

    const activityHTML = recentRecipes.map(recipe => `
        <div class="activity-item">
            <div class="activityIcon"><i class="fas fa-book"></i></div>
            <div>
                <h4>New recipe added</h4>
                <p>"${recipe.name}" by ${recipe.foodType || 'Unknown'}</p>
            </div>
            <small>Recently added</small>
        </div>
    `).join('');

    activityCard.innerHTML = `
        <h2>Recent Activity</h2>
        ${activityHTML}
    `;
}

// Function to update recent recipes table
function updateRecentRecipesTable(recipes)
{
    const tableBody = document.querySelector('.activityCard table tbody');
    if (!tableBody) return;

    // Sort recipes by ID and take the most recent 3
    const recentRecipes = [...recipes].sort((a, b) => b.id - a.id).slice(0, 3);

    const tableHTML = recentRecipes.map(recipe => `
        <tr>
            <td>${recipe.name}</td>
            <td>${recipe.foodType || 'Unknown'}</td>
            <td><span class="statusTABLE publishedTABLE">Published</span></td>
            <td>
                <button class="editButton" onclick="editRecipe(${recipe.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="deleteButton" onclick="deleteRecipe(${recipe.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');

    tableBody.innerHTML = tableHTML;
}

// Function to handle search
function handleSearch()
{
    const searchInput = document.querySelector('.search-input');
    if (searchInput)
    {
        searchInput.addEventListener('keypress', async function(e)
        {
            if (e.key === 'Enter')
            {
                const searchValue = this.value.trim();
                if (searchValue)
                {
                    if (isSafeText(searchValue))
                    {
                        const recipes = await loadRecipes();
                        const foundRecipe = recipes.some(recipe =>
                            recipe.name.toLowerCase().includes(searchValue.toLowerCase())
                        );
                        
                        if (foundRecipe)
                        {
                            window.location.href = 'recipes.html?query=' + encodeURIComponent(searchValue);
                        } 
                        else
                        {
                            alert(`"${searchValue}" not found. Please try another search.`);
                            this.focus();
                        }
                    } 
                    else
                    {
                        alert('Invalid search input. Please use only letters, numbers, and basic punctuation.');
                        this.value = '';
                        this.focus();
                    }
                }
            }
        });
    }
}

// Function to handle navigation
function handleNavigation()
{
    const navButtons = document.querySelectorAll('.nav-link');
    navButtons.forEach(link =>
    {
        link.addEventListener('click', function(e)
        {
            if (this.getAttribute('href') === '../accounts/login.html')
            {
                e.preventDefault();
                if (confirm('Are you sure you want to log out?'))
                {
                    window.location.href = '../accounts/login.html';
                }
            }
        });
    });
}

// Function to handle stat card buttons
function handleStatButtons()
{
    const greenButtons = document.querySelectorAll('.prim_greenButton');
    greenButtons.forEach(button =>
    {
        button.addEventListener('click', function()
        {
            const parent = this.closest('.statCard');
            if (parent)
            {
                const paragraph = parent.querySelector('p');
                if (paragraph)
                {
                    const cardText = paragraph.textContent;
                    if (cardText.includes('Recipes'))
                    {
                        window.location.href = 'recipes.html';
                    } 
                    else if (cardText.includes('Users'))
                    {
                        window.location.href = 'users.html';
                    } 
                    else if (cardText.includes('Categories'))
                    {
                        window.location.href = 'categories.html';
                    }
                }
            }
        });
    });
}

// Function to edit recipe
function editRecipe(id)
{
    window.location.href = `Edit-Recipe.html?id=${id}`;
}

// Function to delete recipe
async function deleteRecipe(id)
{
    if (confirm('Are you sure you want to delete this recipe?'))
    {
        const recipes = await loadRecipes();
        const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
        
        // In a real application, you would send this to your backend
        // For now, we'll just update the display
        updateRecentRecipesTable(updatedRecipes);
        updateStatistics();
    }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', async () =>
{
    // Update statistics and recent activity
    await updateStatistics();
    
    // Load recipes and update the table
    const recipes = await loadRecipes();
    updateRecentRecipesTable(recipes);
    
    // Initialize event handlers
    handleSearch();
    handleNavigation();
    handleStatButtons();
});
