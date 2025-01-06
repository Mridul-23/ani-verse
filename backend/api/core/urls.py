from django.urls import path

from . import views

urlpatterns = [
    path('', views.HomeFeed.as_view(), name='home'),
    path('anime_by_genre/', views.ShowsByGenre.as_view(), name='genre_by_anime'),
    path('search_anime/', views.SearchAnimeView.as_view(), name='search_anime'),
]