from django.urls import path
from . import views

urlpatterns = [
    path("recipe/", views.viewRecipe, name="viewRecipe"),
    path("addRecipe/", views.addRecipe, name="addRecipes"),
    path("editRecipe/", views.editRecipe, name="editRecipe"),
]