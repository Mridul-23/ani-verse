from django.urls import path

from . import views

urlpatterns = [
    path('', views.GetRecommendationsView.as_view(), name='get_recommendations'),
    path('initialize/', views.UserRecommendationSession.as_view(), name='initialize_user_recommendation_session'),
]
