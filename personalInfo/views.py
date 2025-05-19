from django.shortcuts import render, redirect
from django.contrib import messages
from .models import FavoriteRecipes
from datetime import datetime

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



def edit_profile(request):
    if request.method == 'POST':
        user = request.user        
        try:
            new_first_name = request.POST.get('editFirstname')
            new_last_name = request.POST.get('editLastname')
            new_email = request.POST.get('editEmail')
            birth_date_str = request.POST.get('editDatebirth')
            new_birthDate = datetime.strptime(birth_date_str, '%Y-%m-%d').date()

            user.first_name = new_first_name
            user.last_name = new_last_name
            user.email = new_email
            user.birthDate = new_birthDate

            user.save()
        except Exception as e:
            messages.error(request, f'Error updating profile: {str(e)}')

        return redirect('profile')



def favoriteRecipes(request):
    if request.user.is_authenticated:
        if request.user.account_type == 1:
            return redirect('dashboard')
        else:
            favs = FavoriteRecipes.objects.filter(user=request.user).select_related('recipe')
            return render(request, "user/favourites.html", {'favs': favs})
    else:
        return redirect('login')