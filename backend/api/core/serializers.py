from .models import Anime, Studio, Demographic, Genre, Rating, Source, TypeOf
from profiles_api.models import UserProfile

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
        fields = ['unique_id', 'name', 'name_english', 'ranked', 'imagelink', 'typeof', 'total_episodes', 'genre']
    
    def get_genre(self, obj):
        return [genre.name for genre in obj.genre.all()]
    
    def get_typeof(self, obj):
        return obj.typeof.name


class AnimeSerializer(serializers.ModelSerializer):
    class Meta:
        Model = Anime
        fields = ['name', 'name_english', 'score', 'ranked']


class SearchRequestAnimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anime
        fields = ['name', 'name_english', 'unique_id']


class AnimeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anime
        depth = 1
        exclude = ['vector_rep']

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # For removing the id field from the related models
        if 'rating' in representation:
            representation['rating'] = representation['rating'].get('name')

        if 'studio' in representation:
            representation['studio'] = representation['studio'].get('name')

        if 'demographic' in representation:
            representation['demographic'] = representation['demographic'].get('name')

        if 'source' in representation:
            representation['source'] = representation['source'].get('name')

        if 'typeof' in representation:
            representation['typeof'] = representation['typeof'].get('name')

        if 'genre' in representation:
            representation['genre'] = [genre.get('name') for genre in representation['genre']]

        return representation
