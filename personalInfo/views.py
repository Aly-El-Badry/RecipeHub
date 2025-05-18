from django.shortcuts import render

# Create your views here.
def profile(request):
    return render(request, "User/profile_page.html")

def favoriteRecipes(request):
    return render(request, "User/favourites.html")
