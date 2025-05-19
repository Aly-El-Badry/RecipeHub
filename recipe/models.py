from django.db import models
from django.db.models import JSONField
import cloudinary
import cloudinary.uploader
from django.core.exceptions import ValidationError

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

    def save(self, *args, **kwargs):
        if self.image and not self.image.startswith('https://res.cloudinary.com'):
            try:
                # Upload to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    self.image,
                    folder="recipe_app/",
                    public_id=f"recipe_{self.name.lower().replace(' ', '_')}",
                    overwrite=True,
                    resource_type="image"
                )
                self.original_image_url = self.image
                self.image = upload_result['secure_url']
            except Exception as e:
                raise ValidationError(f"Image upload failed: {str(e)}")
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-id']
