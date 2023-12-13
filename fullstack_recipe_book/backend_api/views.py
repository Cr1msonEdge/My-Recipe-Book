from rest_framework.views import APIView
from .models import Recipe, User, Category, Measure, Ingredient, Cousin, Composition, Rating, Rank, Ban
from .serializer import (RecipeSerializer, UserSerializer, CategorySerializer, MeasureSerializer, IngredientSerializer,
                         CousinSerializer, CompositionSerializer, RatingSerializer, RankSerializer, BanSerializer)
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed, NotAcceptable
import jwt, datetime
from rest_framework.parsers import MultiPartParser, FormParser
from .services import RelevantSearch, RankHandler


# Create your views here.

img_root = 'http://localhost:8000/media/'
recipe_img_root_default = img_root + 'img/rank3.jpg'
user_img_root = img_root + 'user_img'


class RegisterView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        email = request.data['email']
        someuser = User.objects.filter(email=email).first()
        if someuser is not None:
            raise AuthenticationFailed("User already exists")
        username = request.data['username']
        someuser = User.objects.filter(username=username).first()
        if someuser is not None:
            raise AuthenticationFailed("User already exists")
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed("User not found")

        if not user.check_password(password):
            raise AuthenticationFailed("Incorrect password")

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=90),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }
        return response


class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed("Unauthenticated")

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")

        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        print('srl', serializer.data)
        ans = {"detail": "success"}
        for i in serializer.data.keys():
            ans[i] = serializer.data[i]

        if ans['avatar'] is None:
            if user.is_staff:
                ans['avatar'] = user_img_root + '/moderator.jpg'
            elif user.is_banned:
                ans['avatar'] = user_img_root + '/banned.jpg'
                ban = Ban.objects.filter(user=user.id).first()
                ans['ban_name'] = ban.name
                ans['ban_info'] = ban.text
            elif user.rank.id == 1:
                ans['avatar'] = user_img_root + '/rank1.jpg'
            elif user.rank.id == 2:
                ans['avatar'] = user_img_root + '/rank2.jpg'
            elif user.rank.id == 3:
                ans['avatar'] = user_img_root + '/rank3.jpg'
        ans['toNextRank'] = RankHandler.toNextRank(user.id)
        return Response(ans)


class UserIdView(APIView):
    def get(self, request, pk):
        s = User.objects.filter(id=pk).first()
        if s is None:
            return Response('No one found')
        temp = {"id": s.id, "name": s.username, "email": s.email, "rank": s.rank, "about": s.about,
                "is_staff": s.is_staff, "is_banned": s.is_banned}
        if s.rank is not None:
            temp['rank'] = s.rank.name
        if s.is_staff:
            temp['avatar'] = user_img_root + '/moderator.jpg'
        elif s.is_banned:
            temp['avatar'] = user_img_root + '/banned.jpg'
            ban = Ban.objects.filter(user=s.id).first()
            temp['ban_name'] = ban.name
            temp['ban_info'] = ban.text
        elif s.rank.id == 1:
            temp['avatar'] = user_img_root + '/rank1.jpg'
        elif s.rank.id == 2:
            temp['avatar'] = user_img_root + '/rank2.jpg'
        elif s.rank.id == 3:
            temp['avatar'] = user_img_root + '/rank3.jpg'
        return Response(temp)

    def delete(self, request, pk):
        s = User.objects.filter(id=pk).first()
        s.delete()
        return Response('Success')

    def patch(self, request, pk):
        s = User.objects.filter(id=pk).first()
        serializer = UserSerializer(s, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response('Success')


class LogoutView(APIView):
    def post(self, request):
        # remove cookie
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response


class RecipeListView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        result = []
        for output in Recipe.objects.filter(is_published=True):
            temp = {
                "id": output.id,
                "name": output.name,
                "short_description": output.short_description,
                "category": output.category.id,
                "difficulty": output.difficulty,
                "instruction": output.instruction,
                "image": img_root + output.image.name,
                "is_published": output.is_published,
            }

            # username
            if output.user is not None:
                temp['user'] = output.user.username
            else:
                temp['user'] = 'Unknown'

            temp['rating'] = RankHandler.getRating(output.id)

            if output.cousin is None:
                temp['cousin'] = 'Не выбрано'
            else:
                temp['cousin'] = output.cousin.name

            # images
            if output.image.name == '':
                temp['image'] = img_root + 'img/rank3.jpg'

            # ingredients
            compositions = Composition.objects.filter(recipe=output.id)
            temp['ingredients'] = []
            for composition in compositions:
                temp['ingredients'].append(composition.ingredient.slug)
            result.append(temp)
        return Response(result)

    def post(self, request):
        recipe_data = request.data
        recipe_serializer = RecipeSerializer(data=recipe_data)
        recipename = recipe_data['name']
        somerecipe = Recipe.objects.filter(name=recipename).first()
        if somerecipe is not None:
            raise NotAcceptable("Recipe with such name already exists")
        if recipe_serializer.is_valid(raise_exception=True):
            temp = recipe_serializer.save()
            result = {'id': temp.id, 'data': recipe_serializer.data}
            return Response(result)

    def delete(self, request):
        e = Recipe.objects.all()
        for el in e:
            el.delete()
        return Response({
            "message": "deleted "
        })

    def patch(self, request):
        e = Recipe.objects.all()
        for el in e:
            serializer = RecipeSerializer(el, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
        return Response('Success')


class RecipeAllView(APIView):
    def get(self, request):
        recipes = Recipe.objects.all()
        result = []
        for rcp in recipes:
            output = {
                "id": rcp.id,
                "name": rcp.name,
                "short_description": rcp.short_description,
                "difficulty": rcp.difficulty,
                "instruction": rcp.instruction,
                "category": rcp.category.name,
                "image": img_root + rcp.image.name,
            }
            result.append(output)
        return Response(result)


class RecipeView(APIView):
    def get(self, request, pk):
        rcp = Recipe.objects.get(pk=pk)
        output = {
            "id": rcp.id,
            "name": rcp.name,
            "short_description": rcp.short_description,
            "difficulty": rcp.difficulty,
            "instruction": rcp.instruction,
            "category": rcp.category.name,
            "image": img_root + rcp.image.name,
        }
        # ингредиенты
        ingr = Composition.objects.filter(recipe=rcp.id)
        if ingr is None:
            output['ingredients'] = []
        else:
            output['ingredients'] = []
            for i in ingr:
                temp = {
                    'ingredient': i.ingredient.name,
                    'value': i.value,
                    'measure': i.ingredient.measure.name
                }
                output['ingredients'].append(temp)
        # автор
        author = User.objects.get(pk=rcp.user.id)
        output['author'] = {'id': author.id, 'username': author.username}

        output['rating'] = RankHandler.getRating(output['id'])
        if rcp.image.name == '':
            output['image'] = img_root + 'img/rank3.jpg'
        return Response(output)

    def delete(self, request, pk):
        rcp = Recipe.objects.get(pk=pk)
        rcp.delete()
        return Response({
            "message": "deleted " + str(pk)
        })

    def patch(self, request, pk):
        e = Recipe.objects.get(pk=pk)
        serializer = RecipeSerializer(e, data=request.data, partial=True)
        RankHandler.RankUpdate(e.user.id)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response('Success')


class CategoryListView(APIView):
    def get(self, request):
        output = [
            {
                "name": output.name.capitalize(),
                "slug": output.slug,
                "id": output.id,
            } for output in Category.objects.all()
        ]

        return Response(output)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    def delete(self, request):
        e = Category.objects.all()
        for el in e:
            el.delete()
        return Response({
            "message": "deleted all categories"
        })


class CategoryIntView(APIView):
    def get(self, request, pk):
        e = Category.objects.get(pk=pk)
        output = {
            'id': e.id,
            'name': e.name,
            'slug': e.slug,
        }
        recipes_in_category = [
            {
                'id': recipe.id,
                'name': recipe.name,
                'short_description': recipe.short_description,
                'difficulty': recipe.difficulty
            } for recipe in Recipe.objects.filter(category=e.id)
        ]
        output['recipes'] = recipes_in_category
        return Response(output)

    def delete(self, request, pk):
        e = Category.objects.get(pk=pk)
        e.delete()
        return Response({"message": "Deleted " + str(pk)})


class CategorySlugView(APIView):
    def get(self, request, slug):
        e = Category.objects.get(slug=slug)
        output = {
            'id': e.id,
            'name': e.name,
            'slug': e.slug,
        }
        recipes_in_category = []
        for recipe in Recipe.objects.filter(category=e.id):
            temp = {
                'id': recipe.id,
                'name': recipe.name,
                'short_description': recipe.short_description,
                'difficulty': recipe.difficulty
            }
            rating = Rating.objects.filter(recipe=recipe.id)
            temp['rating'] = RankHandler.getRating(recipe.id)
            if recipe.image.name == '':
                temp['image'] = recipe_img_root_default
            else:
                temp['image'] = img_root + recipe.image.name
            recipes_in_category.append(temp)

        output['recipes'] = recipes_in_category
        return Response(output)

    def delete(self, request, slug):
        e = Category.objects.get(slug=slug)
        e.delete()
        return Response({"message": "Deleted " + slug})

    def patch(self, request, slug):
        e = Category.objects.get(slug=slug)
        serializer = CategorySerializer(e, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response('Success')


class MeasureListView(APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "name": output.name,
                "slug": output.slug,
            } for output in Measure.objects.all()
        ]

        return Response(output)

    def post(self, request):
        serializer = MeasureSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    def delete(self, request, pk):
        e = Measure.objects.get(pk=pk)
        e.delete()
        return Response({
            "message": "deleted " + str(pk)
        })


class IngredientListView(APIView):
    def get(self, request):
        ingr = Ingredient.objects.all()
        if ingr.first() is None:
            return Response([])
        output = [
            {
                "id": output.id,
                "name": output.name.capitalize(),
                "measure": output.measure.name,
                "slug": output.slug,
                'is_published': output.is_published
             } for output in ingr
        ]
        return Response(output)

    def post(self, request):
        ingredients = Ingredient.objects.all()
        serializer = IngredientSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    def delete(self, request):
        e = Ingredient.objects.all()
        for el in e:
            el.delete()
        return Response({
            "message": "deleted all"
        })


class IngredientSlugView(APIView):
    def get(self, request, slug):
        e = Ingredient.objects.filter(slug=slug).first()
        result = {
            'id': e.id,
            'name': e.name,
            'slug': e.slug,
            'is_published': e.is_published,
            'measure': e.measure.name,
        }
        return Response(result)

    def delete(self, request, slug):
        e = Ingredient.objects.filter(slug=slug).first()
        e.delete()
        return Response('Success')

    def patch(self, request, slug):
        e = Ingredient.objects.filter(slug=slug).first()
        serializer = IngredientSerializer(e, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class CousinListView(APIView):
    def get(self, request):
        result = []
        for output in Cousin.objects.all():
            temp = {
                'id': output.id,
                'name': output.name.capitalize(),
                'slug': output.slug,
            }
            result.append(temp)

        return Response(result)

    def post(self, request):

        serializer = CousinSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class CousinSlugView(APIView):
    def get(self, request, slug):
        e = Cousin.objects.get(slug=slug)
        output = {
            'id': e.id,
            'name': e.name,
            'slug': e.slug,
            'is_published': e.is_published,
        }

        recipes_in_cousin = []
        for recipe in Recipe.objects.filter(cousin=e.id):
            temp = {
                'id': recipe.id,
                'name': recipe.name,
                'short_description': recipe.short_description,
                'difficulty': recipe.difficulty,
                'image': img_root + recipe.image.name,
            }
            rating = Rating.objects.filter()
            temp['rating'] = RankHandler.getRating(recipe.id)
            recipes_in_cousin.append(temp)
        output['recipes'] = recipes_in_cousin
        return Response(output)

    def delete(self, request, slug):
        e = Cousin.objects.get(slug=slug)
        e.delete()
        return Response({"message": "Deleted " + slug})

    def patch(self, request, slug):
        e = Category.objects.get(slug=slug)
        serializer = CousinSerializer(e, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response('Success')


class CompositionListView(APIView):
    def get(self, request):
        output = [
            {
                'id': output.id,
                'recipe': output.recipe.id,
                'ingredient': output.ingredient.name,
                'value': output.value,
            } for output in Composition.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serializer = CompositionSerializer(data=request.data, many=True)
        print('yy', request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        else:
            recipe = Recipe.objects.get(request.data[0].recipe)
            recipe.delete()
            return Response('Ошибка при сохранении ингредиента рецепта')


class CompositionView(APIView):
    def get(self, request, pk):
        e = Composition.objects.get(pk=pk)
        output = {
            'id': e.id,
            'recipe': e.recipe.name,
            'ingredient': e.ingredient.name,
            'value': e.value,
        }
        return Response(output)

    def delete(self, request, pk):
        e = Composition.objects.get(pk=pk)
        e.delete()
        return Response({
            "message": "deleted " + str(pk)
        })


class UserAvatarUpload(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        print(request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()


class RatingListView(APIView):
    def get(self, request):
        s = Rating.objects.all()
        output = [
            {
                'id': el.id,
                'user': el.user.id,
                'recipe': el.recipe.name,
                'rating': el.star,
                'weight': el.star * el.user.rank.coefficient
            } for el in s
        ]

        return Response(output)

    def post(self, request):
        serializer = RatingSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response('Success')

    def delete(self, request):
        s = Rating.objects.all()
        for el in s:
            el.delete()


class RatingUserView(APIView):
    def get(self, request, pk):
        s = Rating.objects.filter(user=pk)
        if s.first() is None:
            return Response([])
        else:
            output = []
            for temp in s:
                t = {'user': temp.user.username, 'recipe': temp.recipe.id, 'star': temp.star,
                     'weight': s.star * s.user.rank.coefficient}
                output.append(t)
            return Response(output)

    def delete(self, request, pk):
        s = Rating.objects.get(user=pk)
        s.delete()
        return Response('Success')


class RatingUserRecipeView(APIView):
    def get(self, request, rk, uk):
        s = Rating.objects.filter(recipe=rk, user=uk).first()
        if s is None:
            return Response('Not found')
        t = {'user': s.user.username, 'recipe': s.recipe.id, 'star': s.star, 'weight': s.star * s.user.rank.coefficient}

        return Response(t)

    def patch(self, request, rk, uk):
        s = Rating.objects.filter(recipe=rk, user=uk).first()
        serializer = RatingSerializer(s, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class RankListView(APIView):
    def get(self, request):
        output = []
        for element in Rank.objects.all():
            temp = {
                'id': element.id,
                'name': element.name,
                'slug': element.slug,
                'coef': element.coefficient,
                'requirement': element.requirement
            }
            output.append(temp)
        return Response(output)

    def post(self, request):
        serializer = RankSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response('Success')

    def patch(self, request):
        s = Rank.objects.get(pk=3)
        serializer = RankSerializer(s, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response('Success')


class ModerationView(APIView):
    def get(self, request):
        output = []
        for element in Recipe.objects.filter(is_published=False):
            temp = {
                "id": element.id,
                "name": element.name,
                "short_description": element.short_description,
                "category": element.category.id,
                "difficulty": element.difficulty,
                "instruction": element.instruction,
                "image": img_root + element.image.name,
            }
            if element.user is not None:
                temp['user'] = element.user.username
            else:
                temp['user'] = 'Unknown'
            temp['type'] = 'Recipe'
            output.append(temp)
        for element in Ingredient.objects.filter(is_published=False):
            temp = {"id": element.id, "name": element.name, "measure": element.measure.name, "slug": element.slug,
                    'type': 'Ingredient'}
            output.append(temp)
        for element in Cousin.objects.filter(is_published=False):
            temp = {
                'id': element.id,
                'name': element.name,
                'slug': element.slug,
                'type': 'Cousin'
            }
            output.append(temp)
        for element in Category.objects.filter(is_published=False):
            temp = {
                'id': element.id,
                'name': element.name,
                'slug': element.slug,
                'type': 'Category',
            }
            output.append(temp)

        return Response(output)


class RelevantView(APIView):
    def post(self, request):
        output = RelevantSearch.resultingRecipes(request.data)
        result = []
        if len(request.data) == 0:
            output = Recipe.objects.all()
            for element in output:
                temp = {
                    "id": element.id,
                    "name": element.name,
                    "short_description": element.short_description,
                    "category": element.category.id,
                    "difficulty": element.difficulty,
                    "instruction": element.instruction,
                    "image": img_root + element.image.name,
                    'rating': RankHandler.getRating(element.id)}
                result.append(temp)
            return Response(result)
        for i in output:
            element = Recipe.objects.get(id=i)
            temp = {
                "id": element.id,
                "name": element.name,
                "short_description": element.short_description,
                "category": element.category.id,
                "difficulty": element.difficulty,
                "instruction": element.instruction,
                "image": img_root + element.image.name,
                'rating': RankHandler.getRating(i)}
            result.append(temp)
        return Response(result)


class BanUserView(APIView):
    def patch(self, request):
        email = request.data['email']
        user = User.objects.filter(email=email)
        if user.first() is None:
            return Response("Пользователь не найден.")
        user = user.first()
        serializer = UserSerializer(user, data={'is_banned': True}, partial=True)
        ban_data = request.data
        ban_data['user'] = user.id
        ban_serializer = BanSerializer(data=ban_data)
        if serializer.is_valid(raise_exception=True) and ban_serializer.is_valid(raise_exception=True):
            ban_serializer.save()
            serializer.save()
            return Response("Пользователь успешно заблокирован.")

    def delete(self, request):
        email = request.data['email']
        user = User.objects.filter(email=email)
        if user.first() is None:
            return Response("Пользователь не найден.")
        user = user.first()
        user_reviews = Rating.objects.filter(user=user.id)
        for review in user_reviews:
            review.delete()
        return Response('Успешно удалены оценки пользователя')


class NewModeratorView(APIView):
    def patch(self, request):
        email = request.data['email']
        user = User.objects.filter(email=email)
        if user.first() is None:
            return Response("Ошибка: Пользователь не найден")
        user = User.objects.get(email=email)
        serializer = UserSerializer(user, data={'is_staff': True}, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response("Пользователь успешно повышен до модератора.")


class BanListView(APIView):
    def get(self, request):
        bans = Ban.objects.all()
        output = []
        for ban in bans:
            temp = {'id': ban.id, 'name': ban.name, 'text': ban.text, 'user': ban.user.id}
            output.append(temp)
        return Response(output)

    def post(self, request):
        serializer = BanSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response('Success')
        return Response('Something went wrong')

    def delete(self, request):
        for ban in Ban.objects.all():
            ban.delete()
        return Response('DEleted all')
