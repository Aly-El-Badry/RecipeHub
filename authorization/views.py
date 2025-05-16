from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import login
from .models import User, PasswordResetCode
from .forms import SignupForm, LoginForm, PasswordResetForm

# Create your views here.
def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save(commit=True)
            user.password = make_password(form.cleaned_data["password"])
            user.save()

            if form.cleaned_data['account_type'] == 1:
                return redirect('admin_dashboard')
            elif form.cleaned_data['account_type'] == 0:
                return redirect('user_dashboard')
    else:
        form = SignupForm()
    return render(request, 'signup.html', {'form': form})



def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = form.user
            login(request, form.user)
            if user.account_type == 1: # Admin
                return redirect('admin_dashboard')
            elif user.account_type == 0: # User
                return redirect('user_dashboard')
        else:
            print(form.errors)
    else:
        form = LoginForm()          
    return render(request, 'login.html', {'form': form})



def reset_view(request):
    if request.method == 'POST':
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data['user']
            reset_code = form.cleaned_data['reset_code']
            password = form.cleaned_data['password']
            
            user.set_password(password)
            user.save()

            reset_code.mark_as_used()

            return redirect('login')
    else:
        form = PasswordResetForm()
    return render(request, 'reset-password.html', {'form': form})


import datetime, json
@csrf_exempt
def send_code(request):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON Format'}, status=400)
    
    email = data.get('email', '').strip()

    if not email:
        return JsonResponse({'status': 'error', 'message': 'Email is required'}, status=400)
    
    try:
        user = User.objects.get(email=email)
        code = PasswordResetCode.create_code(user)

        print(f"\n=== PASSWORD RESET CODE ===")
        print(f"User: {user.email}")
        print(f"Code: {code.code}")
        print(f"Created: {code.create_date}")
        print(f"Expires: {code.create_date + datetime.timedelta(minutes=15)}")
        print("===========================\n")

        return JsonResponse({'status': 'success', 'message': 'Code generated'}, status=200)
    
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)