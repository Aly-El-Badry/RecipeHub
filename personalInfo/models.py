from django.db import models
from authorization.models import User
from recipe.models import Recipe
# Create your models here.
class FavoriteRecipes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_recipes')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'recipe')
        verbose_name_plural = 'Favorite Recipes'

    def __str__(self):
        return f"{self.user.email} - {self.recipe.name}"