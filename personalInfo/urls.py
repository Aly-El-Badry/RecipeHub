from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.profile, name="profile"),
    path('favorites/', views.favoriteRecipes, name="favorites"),
    path('edit-profile/', views.edit_profile, name="edit_profile"),
]