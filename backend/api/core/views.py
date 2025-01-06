from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .serializers import GeneralAnimeCardSerializer, SearchRequestAnimeSerializer
from .models import Anime
from .mixins import GenreFilterMixin
from core.models import Genre





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
        return self.queryset.filter(ranked__lt=11).order_by('?').distinct()[:10]


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
        return Anime.objects.filter(name__icontains=query_str)[:10]
