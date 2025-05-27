from .models import UserProfile, SavedAnime, WatchLater

from rest_framework import serializers

from core.models import Anime
from core.serializers import GeneralAnimeCardSerializer


class UserProfileSerializer(serializers.ModelSerializer):

    favourite_anime_name = serializers.SerializerMethodField(read_only=True)
    favourite_anime = serializers.PrimaryKeyRelatedField(
        queryset=Anime.objects.all(),
        required=False,
        allow_null=True
    )

    pfp = serializers.SerializerMethodField()
    pfp_upload = serializers.ImageField(
        write_only=True,
        required=False
    )

    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['user', "pfp"]
    
    def get_pfp(self, obj):
        """
        Return the absolute URL to the Cloudinary-hosted profile pic,
        or None if not set.
        """
        request = self.context.get('request')
        if obj.pfp:
            return request.build_absolute_uri(obj.pfp.url)
        return None
    
    def update(self, instance, validated_data):
        # Handle pfp file upload
        upload = validated_data.pop('pfp_upload', None)
        if upload:
            instance.pfp = upload

        # Update other fields normally
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    
    def get_favourite_anime_name(self, obj):
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