from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import HttpResponseRedirect
from .forms import RecipeForm
from .models import Recipe
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

def editRecipe(request):
    return render(request, "admin/Edit-Recipe.html")

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
