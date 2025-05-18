from django.shortcuts import render, redirect
from recipe.models import Recipe
from authorization.models import  User
# Create your views here.
def home(request):
    return render(request, 'landing.html')

def dashboard(request):
    if request.user.is_authenticated:
        if request.user.account_type == 1:
            recipes = Recipe.objects.all()
            Users = User.objects.all()
            recent_recipes = Recipe.objects.all().order_by('-id')[:3]  # Get the 3 most recent recipes
            
            data = {
                "recipes": recipes.count(),
                "users": Users.count(),
                "recent_recipes": recent_recipes,
            }
            return render(request, "admin/dashboard.html", data)
        else:
            return render(request, "user/dashboard.html")
    else:
        return redirect('login')



def users(request):
    if request.user.is_authenticated:
        if request.user.account_type == 1:
            users = User.objects.all()
            return render(request, "admin/users.html",{"users" : users} )
        else:
            return render(request, "user/dashboard.html")
    else:
        return redirect('login')
    


def handler404(request, exception):
    return render(request, '404.html', status=404)

