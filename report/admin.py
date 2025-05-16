from django.contrib import admin
from .models import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('report_type', 'email', 'created_at', 'status')
    list_filter = ('report_type', 'status', 'created_at')
    search_fields = ('description', 'email')
    readonly_fields = ('created_at',)
    list_per_page = 20
    
    fieldsets = (
        ('Report Information', {
            'fields': ('report_type', 'description', 'screenshot')
        }),
        ('Contact Information', {
            'fields': ('email',)
        }),
        ('Status Information', {
            'fields': ('status', 'created_at')
        }),
    )
