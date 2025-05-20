from django.urls import path
from . import views

urlpatterns = [
    path('submit-report/', views.add_report, name='add_report'),
    path('view-reports/', views.view_reports_list, name="view_reports"),
    path('view-report/<int:report_id>/', views.view_report_detail, name='view_report_detail'),
    path('delete-report/<int:report_id>/', views.delete_report, name='delete_report'),
]