import json
import sqlite3
import cloudinary
import cloudinary.uploader
from pathlib import Path

cloudinary.config(
    cloud_name='dz0lgmr6t',
    api_key='452379711857279',
    api_secret='CFrQSDdxvJfnYdYERIuS8mAjRME'
)

# Load JSON data
with open('D:\\College Files\\Level 2\\Second Semester\\RecipeHub\\RecipeHub\\static\\user\\js\\Data.json', 'r', encoding='utf-8') as f:
    recipes = json.load(f)

# Connect to SQLite database
conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

for recipe in recipes:
    try:
        # Upload image to Cloudinary
        print(f"Uploading image for {recipe['name']}...")
        upload_result = cloudinary.uploader.upload(
            recipe['image'],
            folder="recipe_app/",
            public_id=f"recipe_{recipe['id']}",
            overwrite=True
        )
        cloudinary_url = upload_result['secure_url']
        
        # Prepare SQL query
        query = """
        INSERT INTO recipe_recipe
        (id, name, image, course_type, time, food_type, ingredients, quantity, steps)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        # Convert lists to JSON strings
        ingredients = json.dumps(recipe['ingredients'])
        quantity = json.dumps(recipe['quantity'])
        steps = json.dumps(recipe['steps'])
        
        # Execute query
        cursor.execute(query, (
            recipe['id'],
            recipe['name'],
            cloudinary_url,
            recipe['courseType'],
            recipe['time'],
            recipe.get('foodType', ''),  # Handle missing foodType
            ingredients,
            quantity,
            steps
        ))
        print(f"Added {recipe['name']} to database")
        
    except Exception as e:
        print(f"Error processing {recipe['name']}: {str(e)}")

# Commit and close
conn.commit()
conn.close()
print("All recipes processed!")