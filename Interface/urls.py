from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('dashboard/', views.dashboard, name="dashboard"),
    path('users/', views.users, name="users"),
    path('users/delete/<int:user_id>/', views.delete_user, name="delete_user"),
    path('users/approve/<int:user_id>/', views.approve_user, name="approve_user"),
    path('users/refuse/<int:user_id>/', views.refuse_user, name="refuse_user"),
    path('terms/', views.terms, name="terms"),
]