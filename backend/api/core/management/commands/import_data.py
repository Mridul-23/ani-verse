import json
from django.core.management.base import BaseCommand
from core.models import Anime, Genre, Studio, Rating, Demographic, Source, TypeOf, Picture, Character

class Command(BaseCommand):
    help = "Import anime data from a JSON file"

    def handle(self, *args, **kwargs):
        with open(r'C:\Users\22213\OneDrive\Desktop\ani-verse\backend\data\data.json', 'r', encoding='utf-8') as file:
            data = json.load(file)

            for i, anime_data in enumerate(data):
                # Ensure that if a field is None or missing, it takes the default value
                print(f'{i} {anime_data.get("name", "Unknown Anime")}')

                # Process genres
                genre_objects = []
                for genre_name in anime_data.get('genres', []):
                    genre, _ = Genre.objects.get_or_create(name=genre_name)
                    genre_objects.append(genre)

                # Process studio
                studio_name = anime_data.get('studios', 'Unknown Studio') or 'Unknown Studio'
                studio, _ = Studio.objects.get_or_create(name=studio_name)

                # Process other related fields with default values
                rating, _ = Rating.objects.get_or_create(name=anime_data.get('rating', 'Unknown Rating') or 'Unknown Rating')
                demographic, _ = Demographic.objects.get_or_create(name=anime_data.get('demographic', 'Unknown Demographic') or 'Unknown Demographic')
                source, _ = Source.objects.get_or_create(name=anime_data.get('source', 'Unknown Source') or 'Unknown Source')
                type_of, _ = TypeOf.objects.get_or_create(name=anime_data.get('type_of', 'Unknown Type') or 'Unknown Type')

                # Handle missing or null values for other fields
                anime = Anime.objects.create(
                    name=anime_data.get('name', 'Unknown Anime'),  # Default to 'Unknown Anime' if None or missing
                    name_english=anime_data.get('name_english', 'Unknown English Name'),  # Default to 'Unknown English Name'
                    imagelink=anime_data.get('cover_img', 'un-available'),  # Default to 'un-available'
                    score=float(anime_data.get('score', 0)) if anime_data.get('score') not in [None, 'null', '', 'N/A'] else None,  # Handle 'null' from JSON
                    # ranked=anime_data.get('ranked', 0) if anime_data.get('ranked') not in ["N\/A"] else 0,  # Default to 0 if None or missing
                    ranked= 0 if anime_data.get('ranked')  in ["N\/A", 'N/A'] else anime_data.get('ranked', 0),  # Default to 0 if None or missing
                    members=anime_data.get('members', 0),  # Default to 0 if None or missing
                    synopsis=anime_data.get('synopsis', ''),  # Default to empty string if None or missing
                    aired=anime_data.get('aired', ''),  # Default to empty string if None or missing
                    duration_per_ep=anime_data.get('duration_per_ep', ''),  # Default to empty string if None or missing
                    total_episodes=float(anime_data.get('total_episodes', 0)) if anime_data.get('total_episodes') not in [None, 'null', '', 'Unknown'] else None,  # Handle null
                    premiered=anime_data.get('premiered', 'Unknown'),  # Default to 'Unknown' if None or missing
                    watching=anime_data.get('watching', 0),  # Default to 0 if None or missing
                    completed=anime_data.get('completed', 0),  # Default to 0 if None or missing
                    on_hold=anime_data.get('on_hold', 0),  # Default to 0 if None or missing
                    dropped=anime_data.get('dropped', 0),  # Default to 0 if None or missing
                    plan_to_watch=anime_data.get('plan_to_watch', 0),  # Default to 0 if None or missing
                    total=anime_data.get('total', 0),  # Default to 0 if None or missing
                    scored_by=anime_data.get('scored_by', 0),  # Default to 0 if None or missing
                    favorites=anime_data.get('favorites', 0),  # Default to 0 if None or missing
                    scored_10_by=anime_data.get('scored_10_by', 0),  # Default to 0 if None or missing
                    scored_9_by=anime_data.get('scored_9_by', 0),  # Default to 0 if None or missing
                    scored_8_by=anime_data.get('scored_8_by', 0),  # Default to 0 if None or missing
                    scored_7_by=anime_data.get('scored_7_by', 0),  # Default to 0 if None or missing
                    scored_6_by=anime_data.get('scored_6_by', 0),  # Default to 0 if None or missing
                    scored_5_by=anime_data.get('scored_5_by', 0),  # Default to 0 if None or missing
                    scored_4_by=anime_data.get('scored_4_by', 0),  # Default to 0 if None or missing
                    scored_3_by=anime_data.get('scored_3_by', 0),  # Default to 0 if None or missing
                    scored_2_by=anime_data.get('scored_2_by', 0),  # Default to 0 if None or missing
                    scored_1_by=anime_data.get('scored_1_by', 0),  # Default to 0 if None or missing
                    studio=studio,
                    rating=rating,
                    demographic=demographic,
                    source=source,
                    typeof=type_of
                )

                # Set genres for the anime
                anime.genre.set(genre_objects)

                # Add pictures
                for pic_url in anime_data.get('pics', []):
                    Picture.objects.create(anime=anime, url=pic_url)

                # Add main and side characters
                for main_character in anime_data.get('characters', {}).get('m', []):
                    Character.objects.create(anime=anime, name=main_character, is_main=True)

                for side_character in anime_data.get('characters', {}).get('s', []):
                    Character.objects.create(anime=anime, name=side_character, is_main=False)
