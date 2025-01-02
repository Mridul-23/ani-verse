from django.urls import path

from . import views

urlpatterns = [
    path('', views.HomeFeed.as_view(), name='home'),
    path('<str:genre>/', views.ShowsByGenre.as_view(), name='genre_by_anime'),
]