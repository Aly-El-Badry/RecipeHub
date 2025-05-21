from django import forms
from .models import Recipe
from django.core.exceptions import ValidationError


class RecipeForm(forms.ModelForm):
    ingredients = forms.CharField(widget=forms.Textarea(attrs={'rows': 5}), 
                                help_text="Enter each ingredient on a new line")
    quantity = forms.CharField(widget=forms.Textarea(attrs={'rows': 5}), 
                             help_text="Enter each quantity on a new line")
    steps = forms.CharField(widget=forms.Textarea(attrs={'rows': 5}), 
                          help_text="Enter each step on a new line")

    imageMain = forms.ImageField(required=True) 
    
    class Meta:
        model = Recipe
        fields = ['name', 'imageMain', 'course_type', 'time', 'food_type', 'ingredients', 'quantity', 'steps']
        widgets = {
            'time': forms.NumberInput(attrs={'min': 1}),
        }

    def clean(self):
        cleaned_data = super().clean()
        return cleaned_data

    def clean_ingredients(self):
        ingredients = self.cleaned_data['ingredients']
        return [ingredient.strip() for ingredient in ingredients.split('\n') if ingredient.strip()]

    def clean_quantity(self):
        quantity = self.cleaned_data['quantity']
        return [qty.strip() for qty in quantity.split('\n') if qty.strip()]

    def clean_steps(self):
        steps = self.cleaned_data['steps']
        return [step.strip() for step in steps.split('\n') if step.strip()]

    