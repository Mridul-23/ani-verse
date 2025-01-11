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
    


class FullAnimeDetailsSerializer(serializers.ModelSerializer):
    genre = serializers.SerializerMethodField()
    studio = serializers.SerializerMethodField()
    demographic = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    source = serializers.SerializerMethodField()
    typeof = serializers.SerializerMethodField()

    class Meta:
        model = Anime
        fields = [
            'unique_id', 'name', 'name_english', 'score', 'ranked', 'members', 'scored_by', 'favorites', 'popularity', 'synopsis', 'aired', 'duration_per_ep', 'genre', 'rating', 'studio', 'imagelink', 'demographic', 'total_episodes', 'premiered', 'source', 'typeof', 'watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch', 'total', 'scored_10_by', 'scored_9_by', 'scored_8_by', 'scored_7_by', 'scored_6_by', 'scored_5_by', 'scored_4_by', 'scored_3_by', 'scored_2_by', 'scored_1_by',
        ]

    def get_genre(self, obj):
        return [genre.name for genre in obj.genre.all()]

    def get_studio(self, obj):
        return obj.studio.name if obj.studio else None

    def get_demographic(self, obj):
        return obj.demographic.name if obj.demographic else None

    def get_rating(self, obj):
        return obj.rating.name if obj.rating else None

    def get_source(self, obj):
        return obj.source.name if obj.source else None

    def get_typeof(self, obj):
        return obj.typeof.name if obj.typeof else None

class AnimeSerializer(serializers.ModelSerializer):
    class Meta:
        Model = Anime
        fields = ['name', 'name_english', 'score', 'ranked']


class SearchRequestAnimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anime
        fields = ['name', 'name_english', 'unique_id']