# Generated by Django 5.2.1 on 2025-05-19 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authorization', '0003_alter_user_account_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='account_type',
            field=models.IntegerField(choices=[(0, 'User'), (-1, 'Admin'), (1, 'Admin'), (-2, 'Refused')], default=0),
        ),
    ]
