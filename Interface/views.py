from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'landing.html')

def dashboard(request):
    return render(request, "user/dashboard.html")

def adminDashboard(request):
    return render(request, "admin/dashboard.html")

def handler404(request, exception):
    return render(request, '404.html', status=404)

