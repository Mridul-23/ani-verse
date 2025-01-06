from core.models import Anime
from .models import UserRecommendationHistory

from rest_framework import status
from rest_framework.response import Response


def initialize_user_history(user, data):
    # Validate input data
    show_ids = data.get('show_ids', [])
    show_ratings = data.get('show_ratings', [])
    n_branches = len(show_ids)

    if n_branches < 3:
        return Response({'message': 'Provide at least 3 or more shows with corresponding ratings.'}, 
                        status=status.HTTP_406_NOT_ACCEPTABLE)

    if len(show_ids) != len(show_ratings):
        return Response({'message': 'Number of show IDs and ratings must match.'}, 
                        status=status.HTTP_400_BAD_REQUEST)

    # Ensure user history exists in the database
    for i in range(n_branches):
        show_id = show_ids[i]
        rating = int(show_ratings[i])

        show_obj = Anime.objects.filter(id=show_id).first()
        if not show_obj:
            return Response({'message': f"Show with id '{show_id}' not found."}, 
                            status=status.HTTP_404_NOT_FOUND)

        # Create or get the recommendation history for this arm
        history, created = UserRecommendationHistory.objects.get_or_create(
            user=user,
            arm=i + 1,  # Arms are 1-indexed in the model
        )
        history.recommended_shows.add(show_obj)  # Add the recommended show object
        history.ratings.append(rating)  # Append the rating
        history.save()

    # Initialize session with metadata
    session = user.session  # Django does not directly attach sessions to users
    session['round_no'] = 1
    session['previous_arm'] = 0
    session.modified = True

    return Response({'message': 'User history initialized successfully.'}, 
                    status=status.HTTP_200_OK)


def update_user_history(user, arm, new_ratings, new_shows):
    # Fetch the user's history for the given arm
    history = UserRecommendationHistory.objects.filter(user=user, arm=arm).first()
    if not history:
        raise ValueError(f"No history found for arm {arm}.")

    # Add new recommended shows and ratings
    for show_id, rating in zip(new_shows, new_ratings):
        show_obj = Anime.objects.filter(unique_id=show_id).first()
        if not show_obj:
            raise ValueError(f"Show with ID '{show_id}' not found.")
        history.recommended_shows.add(show_obj)
        history.ratings.append(rating)
    
    history.t += 1  # Increment the counter
    history.save()


def get_user_history(user):
    # Retrieve all arms and their corresponding history
    history = UserRecommendationHistory.objects.filter(user=user).order_by('arm')
    user_history = {
        f'arm{h.arm}': {
            'anime': list(h.recommended_shows.values_list('unique_id', flat=True)),
            'rating': h.ratings,
            't': h.t,
        }
        for h in history
    }
    return user_history


