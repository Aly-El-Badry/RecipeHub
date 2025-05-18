from django.urls import path
from . import views

urlpatterns = [
    path("recipe/<int:id>/", views.viewRecipe, name="viewRecipe"),
    path("add-recipe/", views.addRecipe, name="addRecipes"),
    path("edit-recipe/", views.editRecipe, name="editRecipe"),
    path('addToFav/<int:id>/', views.favoriteRecipe, name="addToFav"),
]