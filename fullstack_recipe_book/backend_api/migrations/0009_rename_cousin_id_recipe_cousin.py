# Generated by Django 4.2.6 on 2023-11-16 19:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend_api', '0008_alter_recipe_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='recipe',
            old_name='cousin_id',
            new_name='cousin',
        ),
    ]
