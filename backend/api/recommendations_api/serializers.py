from .models import UserRecommendationHistory

from rest_framework import serializers

from core.serializers import GeneralAnimeCardSerializer



class UserRecommendationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRecommendationHistory
        fields = '__all__'

class MABRecommendationsSerializer(GeneralAnimeCardSerializer):
    class Meta:
        model = GeneralAnimeCardSerializer.Meta.model
        fields = GeneralAnimeCardSerializer.Meta.fields + ['synopsis']
