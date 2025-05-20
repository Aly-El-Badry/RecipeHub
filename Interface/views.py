from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Q
from recipe.models import Recipe
from authorization.models import  User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
# Create your views here.

def home(request):
    return render(request, 'Interface/landing.html')

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
                recipes = recipes.filter(
                    Q(name__icontains=search_query)
                )

            food_type = request.GET.get('food_type', '')
            if food_type:
                recipes = recipes.filter(Q(food_type=food_type))

            ingredient = request.GET.get('ingredient', '')
            if ingredient:
                recipes = recipes.extra(
                    where=["""EXISTS (
                        SELECT 1 FROM json_each(ingredients) 
                        WHERE json_each.value LIKE %s
                    )"""],
                    params=[f'%{ingredient}%']
                )

            filter_by = request.GET.get('filter_by', '')
            if filter_by == 'recent':
                recipes = recipes.order_by('-id')
            elif filter_by == 'quick_and_easy':
                recipes = recipes.filter(time__lte=30)
            elif filter_by == 'vegetarian':
                recipes = recipes.filter(food_type='Vegetarian')
            elif filter_by == 'dessert':
                recipes = recipes.filter(food_type='Desserts')
            elif filter_by == 'appetizer':
                recipes = recipes.filter(course_type='appetizer')
            elif filter_by == 'main_dish':
                recipes = recipes.filter(course_type='main course')

            context = {
                'recipes': recipes,
                'search_query': search_query,
                'food_type': food_type,
                'ingredient': ingredient,
                'filter_by': filter_by
            }

            return render(request, "user/dashboard.html", context)
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

