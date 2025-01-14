from core.models import Anime
from ..models import UserRecommendationHistory, UserSession

from rest_framework import status
from rest_framework.response import Response





def initialize_user_history(request):
    data = request.data
    user = request.user

    # Validate input data
    show_ids = data.get('show_ids', [])
    show_ratings = data.get('show_ratings', [])
    n_branches = len(show_ids)

    obj, created = UserSession.objects.get_or_create(user=user, round_no=1, previous_arm=0, modified=True)

    if not created:
        return Response({'message': f'User session for -> {user} <- already exists.'})

    if n_branches < 3:
        return Response({'message': 'Provide at least 3 or more shows with corresponding ratings.'}, 
                        status=status.HTTP_406_NOT_ACCEPTABLE)

    if len(show_ids) != len(show_ratings):
        return Response({'message': 'Number of show IDs and ratings must match.'}, 
                        status=status.HTTP_400_BAD_REQUEST)

    # Ensure user history exists in the database
    for i in range(n_branches):
        print("here", i)
        show_id = show_ids[i]
        rating = int(show_ratings[i])

        show_obj = Anime.objects.filter(unique_id=show_id).first()
        if not show_obj:
            return Response({'message': f"Show with id '{show_id}' not found."}, 
                            status=status.HTTP_404_NOT_FOUND)

        # Create or get the recommendation history for this arm
        history, created = UserRecommendationHistory.objects.get_or_create(
            user=user,
            arm=i,  # Arms are 0-indexed in the model
        )
        history.recommended_shows.append(show_obj.unique_id)  # Add the recommended show object
        history.ratings.append(rating)  # Append the rating
        history.save()


    return Response({'message': 'User history initialized successfully.'}, status=status.HTTP_200_OK)


def get_user_history(user):
    # Retrieve all arms and their corresponding history
    history = UserRecommendationHistory.objects.filter(user=user).order_by('arm')
    user_history = {
        f'arm{h.arm}': {
            'anime': h.recommended_shows,
            'rating': h.ratings,
            't': h.t,
        }
        for h in history
    }
    return user_history

def update_user_history(user, arm, ratings, shows):
    # Fetch the user's history for the given arm
    history = UserRecommendationHistory.objects.filter(user=user, arm=arm).first()
    if not history:
        raise ValueError(f"No history found for arm {arm}.")

    # Add new recommended shows and ratings
    for show_id, rating in zip(shows, ratings):
        show_obj = Anime.objects.filter(unique_id=show_id).first()
        if not show_obj:
            raise ValueError(f"Show with ID '{show_id}' not found.")
        history.recommended_shows.append(show_obj.unique_id)
        history.ratings.append(rating)
    
    history.t += 1  # Increment the counter
    history.save()




def delete_user_history_and_session(request):
    i = 0
    while(UserRecommendationHistory.objects.filter(user=request.user, arm=i).exists()):
        UserRecommendationHistory.objects.filter(user=request.user, arm=i).delete()
        i += 1
    
    UserSession.objects.filter(user=request.user).delete()

    return Response({'message': 'user history and session deleted.'})