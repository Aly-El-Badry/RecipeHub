from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name="signup"),
    path('login/', views.login_view, name="login"),
    path('reset-password/', views.reset_view, name="reset_password"),
    path('api/send-reset-code/', views.send_code, name="send-reset-code"),
    path('logout/', views.logout_view, name="logout"),
]