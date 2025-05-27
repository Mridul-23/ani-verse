from django.urls import path, re_path
from . import views

urlpatterns = [
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('favourite/', views.UserFavouritesShows.as_view(), name='user_favourite_list'),
    path('watch_later/', views.UserWatchLaterShows.as_view(), name='user_watch_later_list'),
    re_path(r'^anime/remove/(?P<list_type>favourite|watch_later)/$', views.UserAnimeRemove.as_view(), name='user_anime_remove'),
    path('check_status/<int:id>/', views.CheckListStatus.as_view(), name='user_saved_anime_check'),
]
