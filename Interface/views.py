from django.shortcuts import render, redirect

# Create your views here.
def home(request):
    return render(request, 'landing.html')

def dashboard(request):
    if request.user.is_authenticated:
        if request.user.account_type == 1:
            return render(request, "admin/dashboard.html")
        else:
            return render(request, "user/dashboard.html")
    else:
        redirect('login')

def handler404(request, exception):
    return render(request, '404.html', status=404)

