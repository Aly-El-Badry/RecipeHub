from django import forms

class UserImageForm(forms.Form):
    profile_image = forms.ImageField()