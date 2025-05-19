from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Q
from recipe.models import Recipe
from authorization.models import  User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
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
        elif request.user.account_type == -1: 
            return render(request, "pending.html")
        elif request.user.account_type == -2:
            return render(request, "refused.html")
    else:
        return redirect('login')



def users(request):
    if request.user.is_authenticated:
        if request.user.account_type == 1:
            users = User.objects.all().order_by('id')
            search_query = request.GET.get('search', '')
            if search_query:
                users = User.objects.filter(
                    Q(username__icontains=search_query)
                )
            return render(request, "admin/users.html",{"users" : users, 'search_query': search_query} )
        else:
            return redirect("dashboard")
    else:
        return redirect('login')
    


def handler404(request, exception):
    return render(request, '404.html', status=404)

@login_required
def delete_user(request, user_id):
    if request.user.is_authenticated and request.user.account_type == 1:
        if request.method == 'POST':
            user_to_delete = get_object_or_404(User, id=user_id)
            user_to_delete.delete()
            messages.success(request, 'User deleted successfully!')
        return redirect('users')
    return redirect('dashboard')

@login_required
def approve_user(request, user_id):
    if request.user.is_authenticated and request.user.account_type == 1:
        if request.method == 'POST':
            user_to_approve = get_object_or_404(User, id=user_id)
            user_to_approve.account_type = 1
            user_to_approve.save()
            messages.success(request, 'User approved successfully!')
        return redirect('users')
    return redirect('dashboard')

@login_required
def refuse_user(request, user_id):
    if request.user.is_authenticated and request.user.account_type == 1:
        if request.method == 'POST':
            user_to_refuse = get_object_or_404(User, id=user_id)
            user_to_refuse.account_type = -2
            user_to_refuse.save()
            messages.success(request, 'User refused successfully!')
        return redirect('users')
    return redirect('dashboard')

