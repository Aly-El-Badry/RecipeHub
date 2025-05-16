from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from django.contrib.auth import login
from .forms import SignupForm, LoginForm
from .models import User

# Create your views here.
def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save(commit=True)
            user.password = make_password(form.cleaned_data["password"])
            user.save()

            # if form.cleaned_data['account_type'] == 1:
            #     return redirect('admin/dashboard')
            # elif form.cleaned_data['account_type'] == 0:
            #     return redirect('user/dashboard')

            return redirect('signup') # TO BE REMOVED
    else:
        form = SignupForm()
    return render(request, 'signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = form.user
            login(request, form.user)
            # if user.account_type == 1: # Admin
            #     return redirect('admin_dashboard')
            # elif user.account_type == 0: # User
            #     return redirect('user_dashboard')
        else:
            print(form.errors)
    else:
        form = LoginForm()          
    return render(request, 'login.html', {'form': form})