import math

from django.db.models import Sum

from .models import Composition, Recipe, User, Rating, Rank
from .serializer import UserSerializer


class RelevantSearch:
    @staticmethod
    def count(in_search, in_recipe):
        return len(set(in_search).intersection(set(in_recipe)))

    @staticmethod
    def resultingRecipes(search: list):
        result = []
        recipes = [i[0] for i in Composition.objects.order_by().values_list('recipe').distinct()]
        search = set([i for i in search])

        for i in recipes:
            recipe = Composition.objects.filter(recipe=i)
            ingredients_in_recipe = set([i.ingredient.id for i in recipe])
            temp_count = len(ingredients_in_recipe.intersection(search))
            if temp_count != 0:
                result.append({'recipe': i, 'key': temp_count})
        result.sort(key=lambda x: x['key'], reverse=True)
        print('resulting list ', result)
        return [i['recipe'] for i in result]


class RankHandler:
    @staticmethod
    def getRating(recipe_id):
        reviews = Rating.objects.filter(recipe=recipe_id)

        ranks = Rank.objects.all()
        coef = [i.coefficient for i in ranks]
        ranks_id = [i.id for i in ranks]
        r = []
        n = []
        a = []
        index = 0
        for id in ranks_id:
            temp = reviews.filter(user__rank=id)
            r.append(temp)
            n.append(temp.count())
            a.append((temp.aggregate(res=Sum('star'))['res'] * coef[index]) if n[index] != 0 else 0)
            index += 1
        if sum(n) == 0:
            return 0

        denom_part = [coef[i] * n[i] for i in range(len(coef))]
        return sum(a) / sum(denom_part)

        # c1 = 1
        # c2 = 1.5
        # c3 = 2
        # r1 = reviews.filter(user__rank=1)
        # r2 = reviews.filter(user__rank=2)
        # r3 = reviews.filter(user__rank=3)
        # nc1 = r1.count()
        # nc2 = r2.count()
        # nc3 = r3.count()
        # if nc1 + nc2 + nc3 == 0:
        #     return 0

        # a1 = r1.aggregate(res=Sum('star'))['res'] * c1 if nc1 != 0 else 0
        # a2 = r2.aggregate(res=Sum('star'))['res'] * c2 if nc2 != 0 else 0
        # a3 = r3.aggregate(res=Sum('star'))['res'] * c3 if nc3 != 0 else 0
        # return (a1 + a2 + a3) / (c1 * nc1 + c2 * nc2 + c3 * nc3)

    @staticmethod
    def RankUpdate(user):
        u = User.objects.get(pk=user)
        user_recipes = Recipe.objects.filter(user=user, is_published=True).count()
        rank_list = Rank.objects.order_by('requirement')
        for i in range(len(rank_list) - 1):
            if rank_list[i].requirement <= user_recipes <= rank_list[i + 1].requirement:
                u = UserSerializer(u, data={'rank': rank_list[i].id}, partial=True)
                if u.is_valid(raise_exception=True):
                    u.save()
                    return 'Updated'
        if user_recipes >= rank_list[len(rank_list) - 1].requirement:
            u = UserSerializer(u, data={'rank': rank_list[len(rank_list) - 1].id}, partial=True)
            if u.is_valid(raise_exception=True):
                u.save()
                return 'Updated'
        return 'NotUpdated'

    @staticmethod
    def toNextRank(user):
        ranks = Rank.objects.order_by('requirement')
        user = User.objects.get(pk=user)
        user_recipes = Recipe.objects.filter(user=user.id, is_published=True).count()
        if user.rank.id == ranks.last().id:
            return 0
        for i in range(len(ranks) - 1):
            if user_recipes < ranks[i + 1].requirement:
                return ranks[i + 1].requirement - user_recipes
