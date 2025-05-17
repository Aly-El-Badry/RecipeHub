from django.urls import path
from . import views

urlpatterns = [
    path('', views.admin_dashboard, name='admin_dashboard'),
    path('recipes/', views.admin_recipes, name='admin_recipes'),
    path('recipe-list/', views.admin_recipe_list, name='admin_recipe_list'),
    path('users/', views.admin_users, name='admin_users'),
    path('add-recipe/', views.admin_add_recipe, name='admin_add_recipe'),
    path('edit-recipe/<int:recipe_id>/', views.admin_edit_recipe, name='admin_edit_recipe'),
] 