from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.profile, name="Profile Page"),
    path('favorites/', views.favoriteRecipes, name="Favorite recipes"),
]