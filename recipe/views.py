from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import HttpResponseRedirect
from .forms import RecipeForm
from .models import Recipe
from authorization.models import User
from personalInfo.models import FavoriteRecipes
from django.contrib.auth.decorators import login_required
from django.db.models import Q
import cloudinary
from django.core.exceptions import ValidationError


# Create your views here.
@login_required
def viewRecipe(request, id):
    if request.user.is_authenticated and (request.user.account_type == 0 or request.user.account_type == 1):
        recipe = get_object_or_404(Recipe, id=id)
        status = FavoriteRecipes.objects.filter(user=request.user, recipe=recipe).exists()
        context = {
            'recipe': recipe,
            'ings': zip(recipe.quantity, recipe.ingredients),
            'fav_status': "fas active" if status else "far",
            'fav_message': "Added to favorites" if status else "Add to favorites",
            'acc_type': request.user.account_type
        }
        return render(request, "recipe/view_recipe.html", context=context)
    else:
        return redirect('dashboard')

@login_required
def addRecipe(request):
    if request.user.is_authenticated and request.user.account_type == 1:
        if request.method == 'POST':
            
            form = RecipeForm(request.POST, request.FILES)
            if form.is_valid():
                try:
                    image = form.cleaned_data['imageMain']
                    result = cloudinary.uploader.upload(image)
                    image_url = result['secure_url']
                    
                    recipe = form.save(commit=False)
                    recipe.image = image_url
                    recipe.save()

                    messages.success(request, 'Recipe added successfully!')
                    return redirect('dashboard')
                except ValidationError as e:
                    messages.error(request, str(e))
                    return render(request, "recipe/add_recipe.html", {'form': form})
                except Exception as e:
                    messages.error(request, f'Error saving recipe: {str(e)}')
                    return render(request, "recipe/add_recipe.html", {'form': form})
            else:
                messages.error(request, 'Please correct the errors below.')
        else:
            form = RecipeForm(request.POST, request.FILES)
        recipes = Recipe.objects.all()
        return render(request, "recipe/add_recipe.html", {'form': form, "count": recipes.count()+1})
    else:
        return redirect('dashboard')

@login_required
def manageRecipe(request):
    if request.user.is_authenticated and request.user.account_type == 1:
        recipes = Recipe.objects.all().order_by('id')
        search_query = request.GET.get('search', '')
        if search_query:
            recipes = Recipe.objects.filter(
                Q(name__icontains=search_query)
            )
        return render(request, "recipe/recipes.html", {"recipes": recipes, "search_query": search_query})
    else:
        return redirect('dashboard')

@login_required
def editRecipe(request, id):
    if request.user.is_authenticated and request.user.account_type == 1:
        recipe = get_object_or_404(Recipe, id=id)
        
        if request.method == 'POST':
            if 'add_ingredient' in request.POST:
                # Add a new empty ingredient
                recipe.ingredients.append("")
                recipe.save()
                return render(request, "recipe/edit_recipe.html", {"recipe": recipe})
                
            elif 'add_quantity' in request.POST:
                # Add a new empty quantity
                recipe.quantity.append("")
                recipe.save()
                return render(request, "recipe/edit_recipe.html", {"recipe": recipe})
                
            elif 'add_step' in request.POST:
                # Add a new empty step
                recipe.steps.append("")
                recipe.save()
                return render(request, "recipe/edit_recipe.html", {"recipe": recipe})
                
            elif 'save' in request.POST:
                try:
                    # Update recipe data
                    recipe.name = request.POST.get('name')
                    recipe.course_type = request.POST.get('course_type')
                    recipe.time = request.POST.get('time')
                    recipe.food_type = request.POST.get('food_type')
                    
                    # Handle image upload if a new image was provided
                    if 'image' in request.FILES:
                        image = request.FILES['image']
                        result = cloudinary.uploader.upload(image)
                        recipe.image = result['secure_url']
                    
                    # Handle ingredients, quantities, and steps as line-separated text
                    recipe.ingredients = [ing.strip() for ing in request.POST.get('ingredients').split('\n') if ing.strip()]
                    recipe.quantity = [qty.strip() for qty in request.POST.get('quantity').split('\n') if qty.strip()]
                    recipe.steps = [step.strip() for step in request.POST.get('steps').split('\n') if step.strip()]
                    
                    recipe.save()
                    messages.success(request, 'Recipe updated successfully!')
                    return redirect('manageRecipe')
                except Exception as e:
                    messages.error(request, f'Error updating recipe: {str(e)}')
                    return render(request, "recipe/edit_recipe.html", {"recipe": recipe})
        
        return render(request, "recipe/edit_recipe.html", {"recipe": recipe})
    else:
        return redirect('dashboard')

@login_required
def deleteRecipe(request, id):
    if request.user.is_authenticated and request.user.account_type == 1:
        if request.method == 'POST':
            recipe = get_object_or_404(Recipe, id=id)
            recipe.delete()
            messages.success(request, 'Recipe deleted successfully!')
            return redirect('manageRecipe')
        return redirect('manageRecipe')
    else:
        return redirect('dashboard')

@login_required
def favoriteRecipe(request, id):
    if request.user.is_authenticated and request.user.account_type == 0:
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
        return redirect('dashboard')
