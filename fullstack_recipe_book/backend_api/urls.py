from django.contrib import admin
from django.urls import path, include
from django.urls import re_path as url
from .views import (RegisterView, LoginView, UserView, LogoutView, RecipeListView, CategoryListView, MeasureListView,
                    CategoryIntView, IngredientListView, CousinListView, RecipeView, CompositionListView,
                    CompositionView, CategorySlugView, CousinSlugView, RatingListView, RatingUserView,
                    RatingUserRecipeView, RankListView, UserIdView, ModerationView, IngredientSlugView, RelevantView,
                    RecipeAllView, BanUserView, NewModeratorView, BanListView)

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('posts', RecipeListView.as_view()),
    path('posts/<int:pk>', RecipeView.as_view()),
    path('ingredients', IngredientListView.as_view()),
    path('measures', MeasureListView.as_view()),
    path('categories', CategoryListView.as_view()),
    path('categories/<int:pk>', CategoryIntView.as_view()),
    path('categories/<str:slug>', CategorySlugView.as_view()),
    path('cousins', CousinListView.as_view()),
    path('cousins/<str:slug>', CousinSlugView.as_view()),
    path('composition', CompositionListView.as_view()),
    path('composition/<int:pk>', CompositionView.as_view()),
    path('ratings', RatingListView.as_view()),
    path('ratings/user/<int:pk>', RatingUserView.as_view()),
    path('ratings/user/<int:uk>/recipe/<int:rk>', RatingUserRecipeView.as_view()),
    path('ranks', RankListView.as_view()),
    path('user/<int:pk>', UserIdView.as_view()),
    path('moderate', ModerationView.as_view()),
    path('ingredients/<str:slug>', IngredientSlugView.as_view()),
    path('relevant', RelevantView.as_view()),
    path('recipesall', RecipeAllView.as_view()),
    path('banuser', BanUserView.as_view()),
    path('newmoderator', NewModeratorView.as_view()),
    path('banlist', BanListView.as_view()),
]
# from backend_api.views import *


