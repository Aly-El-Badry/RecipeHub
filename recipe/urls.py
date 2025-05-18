from django.urls import path
from . import views

urlpatterns = [
    path("recipe/", views.viewRecipe, name="view Recipe"),
    path("addRecipe/", views.addRecipe, name="add recipes"),
    path("editRecipe/", views.editRecipe, name="Edit and delete recipe"),
]