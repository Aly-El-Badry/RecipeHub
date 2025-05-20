from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .forms import ReportForm
from .models import Report
from django.contrib.auth.decorators import login_required

@login_required
def add_report(request):
    if request.user.is_authenticated and request.user.account_type == 0:
        if request.method == 'POST':
            form = ReportForm(request.POST, request.FILES)
            if form.is_valid():
                report = form.save()
                messages.success(request, 'Your report has been submitted successfully.')
                return render(request, 'report/report.html', {
                    'form': ReportForm(),
                    'success': True
                })
        else:
            form = ReportForm()
        
        return render(request, 'report/report.html', {
            'form': form,
            'success': False
        })
    else:
        return redirect('dashboard')

@login_required
def view_reports_list(request):
    if request.user.is_authenticated and request.user.account_type == 1:
        reports = Report.objects.all()
        return render(request, 'report/reports_list.html', {'reports': reports})
    else:
        return redirect('dashboard')

@login_required
def view_report_detail(request, report_id):
    if request.user.is_authenticated and request.user.account_type == 1:
        report = get_object_or_404(Report, id=report_id)
        return render(request, 'report/report_detail.html', {'report': report})
    else:
        return redirect('dashboard')