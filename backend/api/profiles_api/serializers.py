from .models import UserProfile, SavedAnime, WatchLater

from rest_framework import serializers

from core.models import Anime
from core.serializers import GeneralAnimeCardSerializer


class UserProfileSerializer(serializers.ModelSerializer):

    favourite_anime = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = '__all__'
    
    def get_pfp(self, obj):
        request = self.context.get('request')
        if obj.post_image:
            return request.build_absolute_uri(obj.pfp.url)
        return None
    
    def get_favourite_anime(self, obj):
        if obj.favourite_anime:
            return obj.favourite_anime.name  
        return None
    

class SavedAnimeSerializer(serializers.ModelSerializer):

    anime = GeneralAnimeCardSerializer(read_only=True)
    id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = SavedAnime
        fields = ['id', 'saved_at', 'anime']
    
    def create(self, validated_data):
        unique_id = validated_data.pop('id')
        try:
            anime = Anime.objects.get(unique_id=unique_id)
        except Anime.DoesNotExist:
            raise serializers.ValidationError({'id': 'Anime not found.'})

        user = self.context['request'].user

        # Optional: prevent duplicates
        if SavedAnime.objects.filter(user=user, anime=anime).exists():
            raise serializers.ValidationError({'anime': 'Anime already in favorites.'})

        return SavedAnime.objects.create(user=user, anime=anime)
    

class WatchLaterAnimeSerializer(serializers.ModelSerializer):

    anime = GeneralAnimeCardSerializer(read_only=True)
    id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = WatchLater
        fields = ['id', 'anime']
    
    def create(self, validated_data):
        unique_id = validated_data.pop('id')
        try:
            anime = Anime.objects.get(unique_id=unique_id)
        except Anime.DoesNotExist:
            raise serializers.ValidationError({'id': 'Anime not found.'})

        user = self.context['request'].user

        # Optional: prevent duplicates
        if WatchLater.objects.filter(user=user, anime=anime).exists():
            raise serializers.ValidationError({'anime': 'Anime already in Watch Later.'})

        return WatchLater.objects.create(user=user, anime=anime)