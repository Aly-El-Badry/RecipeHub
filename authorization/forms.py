from django import forms
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from .models import User, PasswordResetCode

class SignupForm(forms.ModelForm):
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'text-field', 'placeholder': 'Confirm Password', 'type': 'password', 'id': 'confirmPassword'}),
        label="Confirm Password"
    )
    account_type = forms.ChoiceField(
        choices=User.ACCOUNT_TYPE_CHOICES,
        widget=forms.RadioSelect(),
        label="Type"
    )
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password',
                  'confirm_password', 'birthDate', 'account_type']

        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'text-field', 'placeholder': 'First Name', 'type': 'text', 'id': 'FirstName'}),
            'last_name': forms.TextInput(attrs={'class': 'text-field', 'placeholder': 'Last Name', 'type': 'text', 'id': 'LastName'}),
            'username': forms.TextInput(attrs={'class': 'text-field', 'placeholder': 'Username', 'type': 'text', 'id': 'username'}),
            'email': forms.EmailInput(attrs={'class': 'text-field', 'placeholder': 'Email', 'type': 'email', 'id': 'email'}),
            'password': forms.PasswordInput(attrs={'class': 'text-field', 'placeholder': 'Password', 'type': 'password', 'id': 'password'}),
            'birthDate': forms.DateInput(attrs={'class': 'text-field', 'type': 'date', 'id': 'birthDate'})
        }

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password and confirm_password and password != confirm_password:
            self.add_error('confirm_password', "Passwords don't match")

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.password = make_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user
    


class LoginForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'text-field',
            'placeholder': 'Email',
            'id': 'email'
        }),
    )
    
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'text-field',
            'placeholder': 'Password',
            'id': 'password'
        })
    )

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        password = cleaned_data.get("password")

        if email and password:
            self.user = authenticate(
                username=email,
                password=password
            )
            if not self.user:
                raise forms.ValidationError("Invalid Email or Password")

        return cleaned_data
    



class PasswordResetForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'text-field',
            'placeholder': 'Email',
            'id': 'email'
        })
    )
    code = forms.CharField(
        max_length=6,
        widget=forms.TextInput(attrs={
            'class': 'text-field',
            'placeholder': '6-character Code',
            'id': 'code'
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'text-field',
            'placeholder': 'New password',
            'id': 'password'
        }),
        min_length=8
    )

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        password = cleaned_data.get('password')
        code = cleaned_data.get('code')

        if email and code:
            try:
                user = User.objects.get(email=email)
                reset = PasswordResetCode.objects.get(user=user, code=code, used=False)

                if not reset.isValid:
                    raise ValidationError("Invalid or expired code")
                
                cleaned_data['user'] = user
                cleaned_data['reset_code'] = reset
                cleaned_data['password'] = password
            except User.DoesNotExist:
                raise ValidationError("No user with this email exists")
            except PasswordResetCode.DoesNotExist:
                raise ValidationError("Invalid verification code")
            
        return cleaned_data