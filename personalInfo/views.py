from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import FavoriteRecipes
from .forms import UserImageForm
import cloudinary.uploader
from datetime import datetime

# Create your views here.
def profile(request):
    if request.user.is_authenticated:
        form = UserImageForm()
        context = {
            'username': request.user.username,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'email': request.user.email,
            'birth_date': request.user.birthDate,
            'image_url': request.user.profile_image_url,
            'form': form,
        }
        return render(request, "personalInfo/profile_page.html", context=context)
    return redirect('login')


@login_required
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

@login_required
def upload_user_image(request):
    if request.method == 'POST':
        form = UserImageForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                image = form.cleaned_data['profile_image']
                result = cloudinary.uploader.upload(image)

                request.user.profile_image_url = result['secure_url']
                request.user.save()
                messages.success(request, 'Profile image updated successfully!')
            except Exception as e:
                messages.error(request, f'Error uploading image: {str(e)}')
        else:
            messages.error(request, 'Please select a valid image file.')
    else:
        form = UserImageForm()
    
    return redirect('profile')


def favoriteRecipes(request):
    if request.user.is_authenticated:
        if request.user.account_type == 1:
            return redirect('dashboard')
        elif request.user.account_type == 0:
            favs = FavoriteRecipes.objects.filter(user=request.user).select_related('recipe')
            return render(request, "personalInfo/favourites.html", {'favs': favs})
    else:
        return redirect('login')