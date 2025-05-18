from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from .forms import RecipeForm
from .models import Recipe

# Create your views here.
def viewRecipe(request, id):
    return render(request, "User/ViewRecipe.html")

def addRecipe(request):
    if request.method == 'POST':
        form = RecipeForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Recipe added successfully!')
            return redirect('dashboard')
    else:
        form = RecipeForm()
    
    return render(request, "admin/Add-Recipe.html", {'form': form})

def editRecipe(request):
    return render(request, "admin/Edit-Recipe.html")
