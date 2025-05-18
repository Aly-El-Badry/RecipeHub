from django.shortcuts import render

# Create your views here.
def viewRecipe(request):
    return render(request, "User/ViewRecipe.html")

def addRecipe(request):
    return render(request, "admin/Add-Recipe.html")

def editRecipe(request):
    return render(request, "User/Edit-Recipe.html")

