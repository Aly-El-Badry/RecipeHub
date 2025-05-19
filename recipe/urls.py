from django.urls import path
from . import views

urlpatterns = [
    path("recipe/<int:id>/", views.viewRecipe, name="viewRecipe"),
    path("add-recipe/", views.addRecipe, name="addRecipes"),
    path("manage-recipe/", views.manageRecipe, name="manageRecipe"),
    path('addToFav/<int:id>/', views.favoriteRecipe, name="addToFav"),
    path('delete-recipe/<int:id>/', views.deleteRecipe, name="deleteRecipe"),
    path('edit/<int:id>/', views.editRecipe, name="editRecipe")
]