from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

# Create your models here.
class User(AbstractUser):
    ACCOUNT_TYPE_CHOICES = [
        (0, 'User'),
        (1, 'Admin')
    ]

    first_name = models.CharField(max_length=20, blank=False)
    last_name = models.CharField(max_length=20, blank=False)
    username = models.CharField(max_length=22, blank=False, validators=[RegexValidator(regex=r'^[\w.@+-]+$', message="Username must be alphanumeric or contain @/./+/-/_.",),])
    email = models.EmailField(unique=True, max_length=254, blank=False)
    password = models.CharField(max_length=128, blank=False)
    birthDate = models.DateField(blank=False)
    account_type = models.IntegerField(choices=ACCOUNT_TYPE_CHOICES, blank=False, default=0)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username + ' - ' + self.email