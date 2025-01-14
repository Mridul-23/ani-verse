from .serializer import UserProfileSerializer

from .models import UserProfile

from rest_framework import status
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