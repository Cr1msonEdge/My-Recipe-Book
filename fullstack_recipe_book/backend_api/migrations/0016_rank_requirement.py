# Generated by Django 4.2.6 on 2023-12-04 11:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_api', '0015_alter_category_is_published_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='rank',
            name='requirement',
            field=models.IntegerField(null=True),
        ),
    ]
