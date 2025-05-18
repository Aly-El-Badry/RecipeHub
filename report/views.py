from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import ReportForm
from .models import Report

def add_report(request):
    if request.method == 'POST':
        form = ReportForm(request.POST, request.FILES)
        if form.is_valid():
            report = form.save()
            messages.success(request, 'Your report has been submitted successfully.')
            return render(request, 'user/report.html', {
                'form': ReportForm(),
                'success': True
            })
    else:
        form = ReportForm()
    
    return render(request, 'User/report.html', {
        'form': form,
        'success': False
    })


def view_reports_list(request):
    reports = Report.objects.all()
    return render(request, 'admin/reports_list.html', {'reports': reports})