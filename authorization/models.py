from django.db import models, transaction
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.utils import timezone
import secrets
import datetime

# Create your models here.
class User(AbstractUser):
    ACCOUNT_TYPE_CHOICES = [
        (0, 'User'),
        (-1, 'Admin'),
        (1, 'Admin'),
    ]

    first_name = models.CharField(max_length=20, blank=False)
    last_name = models.CharField(max_length=20, blank=False)
    username = models.CharField(max_length=22, blank=False, validators=[RegexValidator(regex=r'^[\w.@+-]+$', message="Username must be alphanumeric or contain @/./+/-/_.",),])
    email = models.EmailField(unique=True, max_length=254, blank=False)
    password = models.CharField(max_length=128, blank=False)
    birthDate = models.DateField(blank=False)
    account_type = models.IntegerField(choices=ACCOUNT_TYPE_CHOICES, blank=False, default=0)
    profile_image_url = models.URLField(max_length=500, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username + ' - ' + self.email
    


class PasswordResetCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reset_codes')
    code = models.CharField(max_length=6, unique=True, editable=False)
    create_date = models.DateTimeField(auto_now_add=True, db_index=True)
    used = models.BooleanField(default=False, db_index=True)

    class Meta:
        verbose_name = "Password Reset Code"
        verbose_name_plural = "Password Reset Codes"
        ordering = ['-create_date']

    @classmethod
    def create_code(cls, user):
        cls.objects.filter(user=user).delete()
        code = secrets.token_hex(3).upper()
        return cls.objects.create(user=user, code=code)
    
    @property
    def isValid(self):
        exp = self.create_date + datetime.timedelta(minutes=15)
        return not self.used and timezone.now() <= exp
    
    def mark_as_used(self):
        self.used = True
        self.save(update_fields=['used'])