# Generated by Django 4.2.6 on 2023-12-11 17:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_api', '0020_ban'),
    ]

    operations = [
        migrations.AddField(
            model_name='ban',
            name='text',
            field=models.TextField(default=''),
        ),
    ]
