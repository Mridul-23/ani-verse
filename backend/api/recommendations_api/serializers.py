from .models import UserRecommendationHistory

from rest_framework import serializers



class UserRecommendationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRecommendationHistory
        fields = '__all__'