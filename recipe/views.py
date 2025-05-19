from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import HttpResponseRedirect
from .forms import RecipeForm
from .models import Recipe
from authorization.models import User
from personalInfo.models import FavoriteRecipes

# Create your views here.
def viewRecipe(request, id):
    if request.user.is_authenticated:
        recipe = get_object_or_404(Recipe, id=id)
        status = FavoriteRecipes.objects.filter(user=request.user, recipe=recipe).exists()
        context = {
            'recipe': recipe,
            'ings': zip(recipe.quantity, recipe.ingredients),
            'fav_status': "fas active" if status else "far",
            'fav_message': "Added to favorites" if status else "Add to favorites"
        }
        return render(request, "user/ViewRecipe.html", context=context)
    else:
        return redirect('login')

def addRecipe(request):
    if request.method == 'POST':
        form = RecipeForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Recipe added successfully!')
            return redirect('dashboard')
    else:
        form = RecipeForm()
    
    recipes = Recipe.objects.all()
    return render(request, "admin/Add-Recipe.html", {'form': form, "count" : recipes.count()+1})

def manageRecipe(request):
    recipes = Recipe.objects.all()
    return render(request, "admin/recipes.html", {"recipes": recipes})

def editRecipe(request, id):
    recipe = get_object_or_404(Recipe, id=id)
    
    if request.method == 'POST':
        if 'add_ingredient' in request.POST:
            # Add a new empty ingredient
            recipe.ingredients.append("")
            recipe.save()
            return render(request, "admin/Edit-Recipe.html", {"recipe": recipe})
            
        elif 'add_quantity' in request.POST:
            # Add a new empty quantity
            recipe.quantity.append("")
            recipe.save()
            return render(request, "admin/Edit-Recipe.html", {"recipe": recipe})
            
        elif 'add_step' in request.POST:
            # Add a new empty step
            recipe.steps.append("")
            recipe.save()
            return render(request, "admin/Edit-Recipe.html", {"recipe": recipe})
            
        elif 'save' in request.POST:
            # Update recipe data
            recipe.name = request.POST.get('name')
            recipe.course_type = request.POST.get('course_type')
            recipe.time = request.POST.get('time')
            recipe.food_type = request.POST.get('food_type')
            recipe.image = request.POST.get('image')
            
            # Handle ingredients, quantities, and steps as line-separated text
            recipe.ingredients = [ing.strip() for ing in request.POST.get('ingredients').split('\n') if ing.strip()]
            recipe.quantity = [qty.strip() for qty in request.POST.get('quantity').split('\n') if qty.strip()]
            recipe.steps = [step.strip() for step in request.POST.get('steps').split('\n') if step.strip()]
            
            recipe.save()
            messages.success(request, 'Recipe updated successfully!')
            return redirect('manageRecipe')
    
    return render(request, "admin/Edit-Recipe.html", {"recipe": recipe})

    
def deleteRecipe(request, id):
    if request.method == 'POST':
        recipe = get_object_or_404(Recipe, id=id)
        recipe.delete()
        messages.success(request, 'Recipe deleted successfully!')
        return redirect('manageRecipe')
    return redirect('manageRecipe')

def favoriteRecipe(request, id):
    if request.user.is_authenticated:
        user = request.user
        recipe = Recipe.objects.get(id=id)
        filter = FavoriteRecipes.objects.filter(user=user, recipe=recipe)
        
        if request.method == 'POST':
            if filter.exists():
                filter.delete()
            else:
                FavoriteRecipes.objects.create(user=user, recipe=recipe)
            return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))
    else:
        return redirect('login')
