from django.contrib import admin

from.models import UserRecommendationHistory, UserSession

admin.site.register(UserSession)
admin.site.register(UserRecommendationHistory)