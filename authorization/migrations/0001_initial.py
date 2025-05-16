import django.core.validators
import django.contrib.auth.models
import django.contrib.auth.validators
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=20)),
                ('last_name', models.CharField(max_length=20)),
                ('username', models.CharField(max_length=22, validators=[django.core.validators.RegexValidator(message='Username must be alphanumeric or contain @/./+/-/_.', regex='^[\\w.@+-]+$')])),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=128)),
                ('birthDate', models.DateField()),
                ('account_type', models.IntegerField(choices=[(0, 'User'), (1, 'Admin')], default=0)),
            ],
        ),
    ]
