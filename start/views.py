from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from recipe.models import Recipe, Category
from authorization.models import User

def is_admin(user):
    return user.is_authenticated and user.is_staff

# Removed decorators for development only - NOT FOR PRODUCTION
def admin_dashboard(request):
    context = {
        'total_recipes': Recipe.objects.count(),
        'total_users': User.objects.count(),
        'total_categories': Category.objects.count(),
        'recent_activities': get_recent_activities()
    }
    return render(request, 'admin/dashboard.html', context)

@login_required
@user_passes_test(is_admin)
def admin_recipes(request):
    recipes = Recipe.objects.all().order_by('-created_at')
    return render(request, 'admin/recipes.html', {'recipes': recipes})

@login_required
@user_passes_test(is_admin)
def admin_recipe_list(request):
    recipes = Recipe.objects.all().order_by('-created_at')
    return render(request, 'admin/recipe_list.html', {'recipes': recipes})

@login_required
@user_passes_test(is_admin)
def admin_users(request):
    users = User.objects.all().order_by('-date_joined')
    return render(request, 'admin/users.html', {'users': users})

@login_required
@user_passes_test(is_admin)
def admin_add_recipe(request):
    if request.method == 'POST':
        # Handle form submission
        pass
    return render(request, 'admin/Add-Recipe.html')

@login_required
@user_passes_test(is_admin)
def admin_edit_recipe(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)
    if request.method == 'POST':
        # Handle form submission
        pass
    return render(request, 'admin/Edit-Recipe.html', {'recipe': recipe})

def get_recent_activities():
    # This is a placeholder function - implement actual activity tracking
    return [
        {
            'icon': 'plus',
            'title': 'New Recipe Added',
            'description': 'A new recipe was added to the system',
            'time_ago': '5 minutes ago'
        },
        {
            'icon': 'user',
            'title': 'New User Registration',
            'description': 'A new user registered to the platform',
            'time_ago': '1 hour ago'
        }
    ] 