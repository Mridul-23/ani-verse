from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import UserRecommendationHistory
from .serializers import UserRecommendationHistorySerializer
from .session_helper import initialize_user_history



# API View to Initialize Recommendation Session
class InitializeUserRecommendationSession(APIView):
    '''
    View to initialize a user's session for the recommendation system upon POST request.
    Expects a dictionary containing initialization data:

    show_ids: List of primary keys (IDs) of shows that the user selected.
    show_ratings: Corresponding ratings for each show provided by the user (values between 0-5).

    Example Input:
    {
        "show_ids": [1, 2, 3],
        "show_ratings": [0, 2, 3]
    }
    '''
    permission_classes = [AllowAny]

    def post(self, request):
        # Pass request data to initialization function
        return initialize_user_history(request.user, request.data)


class GetRecommendationsView(APIView):
    pass