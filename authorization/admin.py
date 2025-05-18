from django.contrib import admin
from .models import User, PasswordResetCode
# Register your models here.
admin.site.register(User)
admin.site.register(PasswordResetCode)