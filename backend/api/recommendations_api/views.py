from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import UserSession
from .utils.recommendation import recommend, get_faiss_recommendations
from .utils.session_helper import initialize_user_history, delete_user_history_and_session, update_user_history, get_user_history

from core.models import Anime
from core.serializers import GeneralAnimeCardSerializer



class UserRecommendationSession(APIView):
    '''
    View to initialize a user's session for the recommendation system upon POST request and delete upon DELETE.
    for POST expects a dictionary containing initialization data:

    show_ids: List of primary keys (IDs) of shows that the user selected.
    show_ratings: Corresponding ratings for each show provided by the user (values between 0-5).

    Example Input:
    {
        "show_ids": [1, 2, 3],
        "show_ratings": [0, 2, 3]
    }
    '''
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return initialize_user_history(request=request)
    
    def delete(self, request):
        return delete_user_history_and_session(request=request)


class GetRecommendationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not UserSession.objects.filter(user=request.user).exists():
            return Response({'message': 'please first initialize user session for recommendations.'}, status=status.HTTP_204_NO_CONTENT)
        
        recommendation = recommend(request)

        return Response({'recommendations': recommendation}, status=status.HTTP_200_OK)

    def post(self, request):
        obj = UserSession.objects.get(user=request.user)
        obj.round_no += 1

        update_user_history(arm=obj.previous_arm, user=request.user, shows=request.data.get('show_ids'), ratings=request.data.get('show_ratings'))

        return Response({'message': 'recieved response.'}, status=status.HTTP_200_OK)
    


class GetSimpleANNRecommendations(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        anime = self.request.query_params.get('id', '')

        try:
            obj = Anime.objects.get(unique_id=anime)
        except Anime.DoesNotExist:
            return Response({'message': f'Anime with id f{anime} does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        recommendations = get_faiss_recommendations(obj.vector_rep)

        qs =  [Anime.objects.get(unique_id=id) for id in recommendations[0][0:]]

        serializer = GeneralAnimeCardSerializer(qs, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
