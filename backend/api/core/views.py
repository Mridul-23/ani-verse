from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView

from .serializers import GeneralAnimeCardSerializer
from .models import Anime
from .mixins import GenreFilterMixin


class HomeFeed(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = GeneralAnimeCardSerializer
    queryset = Anime.objects.all()

    def get_queryset(self):
        return self.queryset.filter(ranked__lt=11).order_by('?').distinct()[:10] # i want to pick top 10 ranked anime

class ShowsByGenre( GenreFilterMixin, ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = GeneralAnimeCardSerializer
    queryset = Anime.objects.all()

    def get_queryset(self):
        genre_name = self.kwargs.get('genre', None)

        if genre_name:
            return self.filter_by_genre(self.queryset, genre_name)
        else:
            return self.queryset.filter(ranked__lt=1000).order_by('?').distinct()[:10]