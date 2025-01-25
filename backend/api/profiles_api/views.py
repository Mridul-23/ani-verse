from .serializer import UserProfileSerializer, SavedAnimeSerializer

from .models import UserProfile, SavedAnime, WatchLater

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated



class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        try :
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({'message': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserProfileSerializer(user_profile, context={'request':request})
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserFavouritesShows(generics.ListAPIView):
    serializer_class = SavedAnimeSerializer
    permission_classes = [IsAuthenticated]
    queryset = SavedAnime.objects.all()

    def get_queryset(self):
        return SavedAnime.objects.filter(user=self.request.user)


class UserWatchLaterShows(generics.ListAPIView):
    serializer_class = SavedAnimeSerializer
    permission_classes = [IsAuthenticated]
    queryset = WatchLater.objects.all()

    def get_queryset(self):
        return WatchLater.objects.filter(user=self.request.user)