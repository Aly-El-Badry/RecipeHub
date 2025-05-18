from django.shortcuts import render, redirect, get_object_or_404
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

def view_report_detail(request, report_id):
    report = get_object_or_404(Report, id=report_id)
    return render(request, 'admin/report_detail.html', {'report': report})