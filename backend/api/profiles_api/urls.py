from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('favourite/', views.UserFavouritesShows.as_view(), name='user_favourite'),
    path('watch_later/', views.UserWatchLaterShows.as_view(), name='user_watch_later'),
    path('anime/remove/<str:list_type>/', views.UserAnimeRemove.as_view(), name='user_anime_remove'),  # To remove from lists
]
