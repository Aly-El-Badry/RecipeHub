from django.db import models
from django.db.models import JSONField

class Recipe(models.Model):
    COURSE_TYPE_CHOICES = [
        ('appetizer', 'Appetizer'),
        ('main course', 'Main Course'),
        ('dessert', 'Dessert'),
        ('snack', 'Snack'),
    ]

    FOOD_TYPE_CHOICES = [
        ('Italian','Italian'),
        ('SeaFood', 'SeaFood'),
        ('Meat', 'Meat'),
        ('Vegetarian', 'Vegetarian'),
        ('Desserts', 'Desserts'),
    ]

    name = models.CharField(max_length=200)
    image = models.URLField()
    course_type = models.CharField(max_length=20, choices=COURSE_TYPE_CHOICES)
    time = models.IntegerField(help_text="Cooking time in minutes")
    food_type = models.CharField(max_length=20, choices=FOOD_TYPE_CHOICES)
    ingredients = JSONField(default=list)
    quantity = JSONField(default=list)
    steps = JSONField(default=list)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-id']
