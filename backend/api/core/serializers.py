from .models import UserProfile, Anime, Genre

from rest_framework import serializers


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

    def validate_age(self, value):
        if value < 1 or value > 100:
            raise serializers.ValidationError('Age must be between 1 and 100.')
        return value



class GeneralAnimeCardSerializer(serializers.ModelSerializer):
    genre = serializers.SerializerMethodField()
    typeof = serializers.SerializerMethodField()
    
    class Meta:
        model = Anime
        fields = ['name_english', 'ranked', 'imagelink', 'typeof', 'total_episodes', 'genre']
    
    def get_genre(self, obj):
        return [genre.name for genre in obj.genre.all()]
    
    def get_typeof(self, obj):
        return obj.typeof.name
    

class AnimeSerializer(serializers.ModelSerializer):
    class Meta:
        Model = Anime
        fields = ['name', 'name_english', 'score', 'ranked', ]