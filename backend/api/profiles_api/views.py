from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import UserProfile, SavedAnime, WatchLater
from .serializers import UserProfileSerializer, SavedAnimeSerializer
from core.models import Anime



class UserProfileView(APIView):
    """
    API view to retrieve the authenticated user's profile.

    Methods:
    - GET: Retrieves the user's profile details.
    """
    
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve the user profile for the authenticated user.
        """
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({'message': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(user_profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserFavouritesShows(generics.ListCreateAPIView):
    """
    API view to list and add animes to the user's saved favorites.

    Methods:
    - GET: Retrieves the list of saved favorite animes for the authenticated user.
    - POST: Adds an anime to the saved favorites list.
    """
    
    serializer_class = SavedAnimeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filter and return the saved favorite animes for the authenticated user.
        """
        return SavedAnime.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """
        Create a new favorite anime entry if it doesn't already exist.
        """
        anime_id = self.request.data.get('id', None)
        if not anime_id:
            raise ValueError("Anime ID is required.")
        
        try:
            anime = Anime.objects.get(unique_id=anime_id)
            serializer.save(user=self.request.user, anime=anime)
        except Anime.DoesNotExist:
            raise ValueError("Anime not found.")
    
    def create(self, request, *args, **kwargs):
        """
        Custom POST method for adding an anime to favorites.
        """
        try:
            return super().create(request, *args, **kwargs)
        except ValueError as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserWatchLaterShows(generics.ListCreateAPIView):
    """
    API view to list and add animes to the user's "watch later" list.

    Methods:
    - GET: Retrieves the list of "watch later" animes for the authenticated user.
    - POST: Adds an anime to the "watch later" list.
    """
    
    serializer_class = SavedAnimeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filter and return the watch later animes for the authenticated user.
        """
        return WatchLater.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """
        Create a new watch later anime entry if it doesn't already exist.
        """
        anime_id = self.request.data.get('id', None)
        if not anime_id:
            raise ValueError("Anime ID is required.")
        
        try:
            anime = Anime.objects.get(unique_id=anime_id)
            serializer.save(user=self.request.user, anime=anime)
        except Anime.DoesNotExist:
            raise ValueError("Anime not found.")
    
    def create(self, request, *args, **kwargs):
        """
        Custom POST method for adding an anime to watch later.
        """
        try:
            return super().create(request, *args, **kwargs)
        except ValueError as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class UserAnimeRemove(APIView):
    """
    API view to remove an anime from the user's saved or watch later list.

    Methods:
    - DELETE: Removes an anime from the user's saved or watch later list.
    """
    
    permission_classes = [IsAuthenticated]

    def delete(self, request, list_type):
        """
        Remove an anime from the specified list (either favorites or watch later).
        """
        saved_anime_id = request.data.get('id', None)

        if not saved_anime_id:
            return Response({'message': 'Anime ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if list_type == "favourite":
                item = SavedAnime.objects.get(id=saved_anime_id, user=request.user)
            elif list_type == "watch_later":
                item = WatchLater.objects.get(id=saved_anime_id, user=request.user)
            else:
                return Response({'message': 'Invalid list type.'}, status=status.HTTP_400_BAD_REQUEST)

            item.delete()
            return Response({'message': f'Anime removed from {list_type} list.'}, status=status.HTTP_200_OK)

        except (SavedAnime.DoesNotExist, WatchLater.DoesNotExist):
            return Response({'message': 'Anime not found in the specified list.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
