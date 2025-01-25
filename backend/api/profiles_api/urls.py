from django.urls import path
from . import views

urlpatterns = [
    path('', views.UserProfileView.as_view(), name='user_profile'),
    path('favourite/', views.UserFavouritesShows.as_view(), name='user_favourite'),
    path('watch_later/', views.UserWatchLaterShows.as_view(), name='user_watch_later'),
]
