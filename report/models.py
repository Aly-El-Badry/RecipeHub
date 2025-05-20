from django.db import models
from django.utils import timezone
import cloudinary
import cloudinary.uploader
from django.core.exceptions import ValidationError

class Report(models.Model):
    REPORT_TYPES = [
        ('incorrect-info', 'Incorrect Recipe Information'),
        ('missing-recipe', 'Missing Recipe'),
        ('technical-issue', 'Technical Issue'),
        ('copyright', 'Copyright Concern'),
        ('other', 'Other'),
    ]

    report_type = models.CharField(
        max_length=20,
        choices=REPORT_TYPES,
        verbose_name='Type of Report'
    )
    
    description = models.TextField(
        verbose_name='Description of the Problem'
    )
    
    image_url = models.URLField(max_length=500, blank=True, null=True)
    
    email = models.EmailField(
        null=True,
        blank=True,
        verbose_name='Reporter Email'
    )
    
    created_at = models.DateTimeField(
        default=timezone.now,
        verbose_name='Report Date'
    )
    
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('in_progress', 'In Progress'),
            ('resolved', 'Resolved'),
            ('closed', 'Closed')
        ],
        default='pending'
    )

    def __str__(self):
        return f"{self.get_report_type_display()} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Report'
        verbose_name_plural = 'Reports'
