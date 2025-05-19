from django.shortcuts import render, redirect
from django.db.models import Q
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
            recent_recipes = Recipe.objects.all().order_by('-id')[:3]  
            
            data = {
                "recipes": recipes.count(),
                "users": Users.count(),
                "recent_recipes": recent_recipes,
            }
            return render(request, "admin/dashboard.html", data)
        elif request.user.account_type == 0:
            recipes = Recipe.objects.all().order_by('id')
            search_query = request.GET.get('search', '')
            if search_query:
                recipes = Recipe.objects.filter(
                    Q(name__icontains=search_query)
                )
            return render(request, "user/dashboard.html", {'recipes': recipes, 'search_query': search_query})
        else: 
            return render(request, "pending.html")
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

