from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

# Create your models here.


def upload_to(instance, filename):
    return 'posts/{filename}'.format(filename=filename)


class User(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    email = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=100)
    about = models.TextField()
    avatar = models.ImageField(_("Image"), upload_to=upload_to, default='posts/rank3.jpg')
    rank = models.ForeignKey('Rank', null=True, on_delete=models.PROTECT)
    is_staff = models.BooleanField(default=False)
    is_banned = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'password']


class Recipe(models.Model):
    name = models.CharField(max_length=50)
    short_description = models.CharField(max_length=100)
    instruction = models.TextField()
    difficulty = models.IntegerField()
    category = models.ForeignKey('Category', on_delete=models.PROTECT, null=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE, null=True)
    cousin = models.ForeignKey('Cousin', on_delete=models.PROTECT, null=True)
    image = models.ImageField(upload_to='img', null=True)
    ingredients = models.ManyToManyField('Ingredient', through='Composition')
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Cousin(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Measure(models.Model):
    name = models.CharField(max_length=10, unique=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True, null=True)

    def __str__(self):
        return self.name


class Rating(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    recipe = models.ForeignKey('Recipe', on_delete=models.CASCADE)
    star = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.star} - {self.recipe}"


class Ingredient(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    measure = models.ForeignKey('Measure', on_delete=models.PROTECT)
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Composition(models.Model):
    recipe = models.ForeignKey('Recipe', on_delete=models.CASCADE)
    ingredient = models.ForeignKey('Ingredient', on_delete=models.CASCADE)
    value = models.FloatField()
    is_published = models.BooleanField(default=False)


class Rank(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=50, unique=True, db_index=True)
    coefficient = models.FloatField()
    requirement = models.IntegerField(null=True)


class Ban(models.Model):
    name = models.CharField(max_length=150, unique=True, db_index=True)
    text = models.TextField(default='')
    user = models.ForeignKey('User', on_delete=models.PROTECT)
