from django.urls import path
from . import views

urlpatterns = [
    path('submit-report/', views.add_report, name='add_report'),
    path('view-reports/', views.view_reports_list, name="view_reports"),
]