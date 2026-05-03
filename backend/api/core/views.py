from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from django.db import connection

import random

from .serializers import GeneralAnimeCardSerializer, SearchRequestAnimeSerializer, AnimeDetailSerializer
from .models import Anime
from .mixins import GenreFilterMixin
from core.models import Genre


class HealthCheckView(APIView):
    """
    Returns the health check status on pinging.

    Permissions:
        - AllowAny
    """
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            return Response({
                "status": "alive",
                "db": "connected"
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "status": "error",
                "db": "disconnected",
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HomeFeed(ListAPIView):
    """
    Returns a random selection of top 10 anime with ranks less than 11.

    Permissions:
        - AllowAny
    """
    permission_classes = [AllowAny]
    serializer_class = GeneralAnimeCardSerializer
    queryset = Anime.objects.all()

    def get_queryset(self):
        ids = list(
            self.queryset.filter(ranked__lt=11).values_list('id', flat=True)
        )
        selected_ids = random.sample(ids, min(len(ids), 10))
        return self.queryset.filter(id__in=selected_ids)


class ShowsByGenre(GenreFilterMixin, ListAPIView):
    """
    Returns anime filtered by genre, or a random list if no genre is provided.

    Permissions:
        - AllowAny

    Expects:
        - Query parameter: /?genre=<search_string>
    """
    permission_classes = [AllowAny]
    serializer_class = GeneralAnimeCardSerializer
    queryset = Anime.objects.all()

    def get_queryset(self):
        genre_name = self.request.query_params.get('genre', None)

        if genre_name:
            try:
                Genre.objects.get(name__iexact=genre_name)
            except Genre.DoesNotExist:
                raise ValidationError(f"Genre '{genre_name}' does not exist.")

            return self.filter_by_genre(self.queryset, genre_name)

        return Anime.objects.none()
    
    def list(self, request, *args, **kwargs):
        """
        Override the list method to return a custom message when no genre is provided.
        """
        genre_name = self.request.query_params.get('genre', None)

        if genre_name is None:

            return Response(
                {'message': "No genre provided, returning."}, 
                status=status.HTTP_204_NO_CONTENT
            )

        return super().list(request, *args, **kwargs)


class ExplorePageAnimeView(ListAPIView):
    """
    Searches anime by name and returns a list of matching results.

    Permissions:
        - AllowAny
    
    Expects:
        - Query parameter: /?anime_name=<search_string>
    """
    permission_classes = [AllowAny]
    serializer_class = GeneralAnimeCardSerializer
    queryset = Anime.objects.all()

    def get_queryset(self):
        query_str = self.request.query_params.get('anime_name', '')

        # Validation: Ensure the search query is not empty
        if not query_str:
            raise ValidationError("The 'anime_name' query parameter is required.")

        # Perform search if query is valid
        return Anime.objects.filter(name_english__icontains=query_str)[:15]


class SearchAnimeView(ListAPIView):
    """
    Searches anime by name and returns a list of matching results.

    Permissions:
        - AllowAny
    
    Expects:
        - Query parameter: /?anime_name=<search_string>
    """
    permission_classes = [AllowAny]
    serializer_class = SearchRequestAnimeSerializer
    queryset = Anime.objects.all()

    def get_queryset(self):
        query_str = self.request.query_params.get('anime_name', '')

        # Validation: Ensure the search query is not empty
        if not query_str:
            raise ValidationError("The 'anime_name' query parameter is required.")

        # Perform search if query is valid
        return Anime.objects.filter(name_english__icontains=query_str)[:6]



class GetAnimeById(ListAPIView):
    """
    Return details of a single anime by id.

    Permissions:
        - AllowAny

    Expects:
        - Query parameter: /?id=<int>
    """
    permission_classes = [AllowAny]
    serializer_class = AnimeDetailSerializer

    def get_queryset(self):
        try:
            q = Anime.objects.filter(unique_id=self.request.query_params.get('id'))
            return q
        except Anime.DoesNotExist:
            return None
        
