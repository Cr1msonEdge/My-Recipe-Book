from rest_framework import serializers
from .models import Recipe, User, Category, Ingredient, Measure, Cousin, Composition, Rating, Rank, Ban


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'about', 'rank', 'is_staff']
        extra_kwargs = {
            'password': {"write_only": True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['id', 'name', 'short_description', 'category', 'difficulty', 'instruction', 'cousin', 'image', 'user',
                  'is_published']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'is_published']


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'measure', 'slug', 'is_published']


class MeasureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measure
        fields = ['id', 'name', 'slug']


class CousinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cousin
        fields = ['id', 'name', 'slug', 'is_published']


class CompositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Composition
        fields = ['id', 'recipe', 'ingredient', 'value']


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'recipe', 'star', 'user']

    def validate(self, data):
        if not (1 <= data['star'] <= 5):
            raise serializers.ValidationError('Invalid amount of rating')
        return data


class RankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rank
        fields = ['id', 'name', 'slug', 'coefficient', 'requirement']


class BanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ban
        fields = ['name', 'text', 'user']
