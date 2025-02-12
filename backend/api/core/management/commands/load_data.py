import csv
import ast
from django.core.management.base import BaseCommand
from core.models import Anime, Studio, Demographic, Genre, Rating, Source, TypeOf

class Command(BaseCommand):
    help = 'Load anime data from CSV file into the database'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, **kwargs):
        csv_file = kwargs['csv_file']
        anime_objects = []  # Store Anime instances for bulk insert
        genre_mapping = {}  # Cache for genres to avoid duplicate DB hits

        # Read CSV file
        with open(csv_file, newline='', encoding='utf-8') as file:
            reader = list(csv.DictReader(file))  

        # First, collect all necessary records
        for row in reader:
            unique_id = int(row['unique_id'])
            print(f"Processing: {unique_id}")

            if not Anime.objects.filter(unique_id=unique_id).exists():
                # Get or create related objects (avoids duplicate queries)
                studio, _ = Studio.objects.get_or_create(name=row.get('studios', 'Unknown Studio'))
                demographic, _ = Demographic.objects.get_or_create(name=row.get('demographic', 'Unknown Demographic'))
                rating, _ = Rating.objects.get_or_create(name=row.get('rating', 'Unknown Rating'))
                source, _ = Source.objects.get_or_create(name=row.get('source', 'Unknown Source'))
                typeof, _ = TypeOf.objects.get_or_create(name=row.get('type_of', 'Unknown Type'))

                # Create Anime object (do not save yet)
                anime = Anime(
                    unique_id=unique_id,
                    name=row['name'],
                    name_english=row['name_english'],
                    score=row['score'],
                    ranked=row['ranked'],
                    popularity=row['popularity'],
                    members=row['members'],
                    synopsis=row['synopsis'],
                    total_episodes=row['total_episodes'],
                    premiered=row['premiered'],
                    duration_per_ep=row['duration_per_ep'],
                    scored_by=row['scored_by'],
                    favorites=row['favorites'],
                    aired=row['aired'],
                    studio=studio,
                    demographic=demographic,
                    rating=rating,
                    source=source,
                    typeof=typeof,
                    watching=row['watching'],
                    completed=row['completed'],
                    on_hold=row['on_hold'],
                    dropped=row['dropped'],
                    plan_to_watch=row['plan_to_watch'],
                    total=row['total'],
                    scored_10_by=row['scored_10_by'],
                    scored_9_by=row['scored_9_by'],
                    scored_8_by=row['scored_8_by'],
                    scored_7_by=row['scored_7_by'],
                    scored_6_by=row['scored_6_by'],
                    scored_5_by=row['scored_5_by'],
                    scored_4_by=row['scored_4_by'],
                    scored_3_by=row['scored_3_by'],
                    scored_2_by=row['scored_2_by'],
                    scored_1_by=row['scored_1_by'],
                )

                anime_objects.append(anime)  # Add to bulk insert list

                # Process genres separately (since many-to-many relationships must be handled after saving)
                genre_list = ast.literal_eval(row['genres'])  
                for genre_name in genre_list:
                    if genre_name not in genre_mapping:
                        genre_mapping[genre_name], _ = Genre.objects.get_or_create(name=genre_name)

        # **Bulk insert Anime records**
        Anime.objects.bulk_create(anime_objects, batch_size=500)

        # **Handle Many-to-Many relationships after saving**
        for anime in anime_objects:
            genres = ast.literal_eval(next(row for row in reader if int(row['unique_id']) == anime.unique_id)['genres'])
            anime.genre.set([genre_mapping[g] for g in genres])  

        print(f"Successfully inserted {len(anime_objects)} anime records!")
