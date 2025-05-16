from django import forms
from django.core.validators import RegexValidator
from .models import Report

class ReportForm(forms.ModelForm):
    REPORT_TYPES = [
        ('', 'Select report type'),
        ('incorrect-info', 'Incorrect Recipe Information'),
        ('missing-recipe', 'Missing Recipe'),
        ('technical-issue', 'Technical Issue'),
        ('copyright', 'Copyright Concern'),
        ('other', 'Other'),
    ]
    
    safe_text_validator = RegexValidator(
        regex=r'^[a-zA-Z0-9\s.,!?-]*$',
        message='Please only use letters, numbers, spaces, and basic punctuation.'
    )
    
    report_type = forms.ChoiceField(
        choices=REPORT_TYPES,
        required=True,
        widget=forms.Select(attrs={'class': 'cust-input'})
    )
    
    description = forms.CharField(
        required=True,
        widget=forms.Textarea(attrs={
            'class': 'cust-input',
            'rows': 5,
            'placeholder': 'Please describe the issue in detail...'
        }),
        validators=[safe_text_validator]
    )
    
    screenshot = forms.ImageField(
        required=False,
        widget=forms.FileInput(attrs={
            'class': 'cust-input',
            'accept': 'image/*'
        })
    )
    
    email = forms.EmailField(
        required=False,
        widget=forms.EmailInput(attrs={
            'class': 'cust-input',
            'placeholder': 'user@example.com'
        })
    )

    class Meta:
        model = Report
        fields = ['report_type', 'description', 'screenshot', 'email']
        widgets = {
            'report_type': forms.Select(attrs={'class': 'cust-input'}),
            'screenshot': forms.FileInput(attrs={
                'class': 'cust-input',
                'accept': 'image/*'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'cust-input',
                'placeholder': 'user@example.com'
            })
        }