from django.shortcuts import render

# Create your views here.
def profile(request):
    if request.user.is_authenticated:
        context = {
            'username': request.user.username,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'email': request.user.email,
            'birth_date': request.user.birthDate
        }
    return render(request, "profile_page.html", context=context)

def favoriteRecipes(request):
    return render(request, "User/favourites.html")
