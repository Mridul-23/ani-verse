import numpy as np
import faiss

from recommendations_api.utils.session_helper import get_user_history

from ..models import UserSession
from core.models import Anime


def recommend(request):
    """
    This function will calculate UCB values, select the best arm, and return the recommendations.
    """
    user = request.user
    session = UserSession.objects.get(user=user)

    # Fetch the user's history from the UserRecommendationHistory model
    user_history_dict = get_user_history(user)
    # print(user_history_dict)

    # Fetch round number and previous arm from session
    round_no = session.round_no

    print(user_history_dict)
    # Calculate UCB values for each arm
    ucb_values = {}
    for i in range(3):  # Assuming there are 3 arms
        t = user_history_dict[f'arm{i}']['t']
        ratings = user_history_dict[f'arm{i}']['rating']
        average_rating = sum(ratings) / len(ratings)
        exploration_term = np.sqrt(2 * np.log(round_no) / t) if t > 0 else float('inf')
        ucb_values[i] = average_rating + exploration_term
        # print(f'ucb value for arm {i} -> {average_rating + exploration_term}')

    # Select the arm with the highest UCB value
    arm = max(ucb_values, key=ucb_values.get)
    print("arm", arm)

    # Get recommendations for the selected arm
    recommendations = get_new_recommendations(arm, user_history_dict)

    # Update round number and arm counter
    round_no += 1

    # Update session with new user history and increment round number
    session.round_no = round_no
    session.previous_arm = arm
    session.modified = True
    session.save()

    # Return the recommended anime shows
    return recommendations



def get_new_recommendations(arm, user_history_dict, num_recommendations=3):
    """
    Given a query vector and a list of already recommended items, this function
    performs a search in the FAISS index to retrieve a set of new recommendations 
    while ensuring the already recommended items are excluded.
    
    Args:
        query_vector (numpy.ndarray): The vector representing the query item for which similar items are to be found.
                                      Should be a 1D array of shape (d,).
        already_recommended (list): A list of indices of items that have already been recommended.
        index (faiss.Index): A FAISS index containing the vectors to search against.
        num_recommendations (int, optional): The number of new recommendations to return. Defaults to 3.
    
    Returns:
        recommendations (list): A list of indices of the new recommended items.
        rec_distances (list): A list of distances to the recommended items.
    """

    index = faiss.read_index(r'C:\Users\22213\OneDrive\Desktop\ani-verse\backend\api\recommendations_api\data\faiss_index.index')
    
    recommendations = list()
    rec_distances = list()

    # Ensure the query vector is in the correct shape (1, d)
    query_animes = []
    query_animes.extend(user_history_dict[f'arm{arm}']['anime'][-5:])

    query_vectors = []

    # Loop through the animes in query_animes
    for anime_id in query_animes:
        try:
            # Get the anime object by unique_id from the database
            obj = Anime.objects.get(unique_id=anime_id)

            # Reshape each vector_rep to (1, -1) to ensure it's a 2D array
            reshaped_vector = np.array(obj.vector_rep).reshape(1, -1)
            query_vectors.append(reshaped_vector)
        except Anime.DoesNotExist:
            print(f"Anime with unique_id {anime_id} not found.")
            continue  # Skip if the anime is not found

    # Combine all query vectors into one single vector (concatenate them)
    query_vector = np.vstack(query_vectors)  # Stack all the vectors vertically

    already_recommended = user_history_dict[f'arm{arm}']['anime']
    # Set a high initial k to ensure enough results even after filtering
    k = num_recommendations + len(already_recommended) + 5

    # Perform the FAISS search for the k nearest neighbors
    distances, faiss_indices = index.search(query_vector, k)

    # Filter out already recommended IDs and collect unique recommendations
    for idx, dist in zip(faiss_indices[0], distances[0]):
        # Ensure the index is not already recommended or in the list of recommendations
        if idx not in already_recommended and idx not in recommendations:
            recommendations.append(idx)
            rec_distances.append(dist)
        
        # Stop when we've collected the desired number of recommendations
        if len(recommendations) == num_recommendations:
            break

    return recommendations



def get_faiss_recommendations(vector, n_rec=13):
    index = faiss.read_index(r'C:\Users\22213\OneDrive\Desktop\ani-verse\backend\api\recommendations_api\data\faiss_index.index')

    vector = np.array(vector).reshape(1, -1)

    distances, faiss_indices = index.search(vector, n_rec)

    return faiss_indices