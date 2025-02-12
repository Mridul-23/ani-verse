import json
import pandas as pd
from django.core.management.base import BaseCommand
from core.models import Anime

class Command(BaseCommand):
    help = "Load anime vector representations from a JSON file into the database"

    def add_arguments(self, parser):
        parser.add_argument("json_file", type=str, help="Path to the JSON file")

    def handle(self, **kwargs):
        json_file = kwargs["json_file"]

        # Load JSON data with Pandas
        data = pd.read_json(json_file)

        # Convert to list of dictionaries (one per row)
        data_dict = data.to_dict(orient="records")

        # Fetch all relevant Anime objects in one query
        unique_ids = [int(row["unique_id"]) for row in data_dict]
        anime_objects = {anime.unique_id: anime for anime in Anime.objects.filter(unique_id__in=unique_ids)}

        updated_anime = []  # List to store modified objects for batch updating

        for row in data_dict:
            unique_id = int(row["unique_id"])
            embedding = row.get("embedding")

            if not embedding:
                print(f"Skipping unique_id {unique_id} (No embedding provided)")
                continue

            anime_instance = anime_objects.get(unique_id)

            if anime_instance:
                print(f"Updating: {anime_instance.name} (unique_id: {unique_id})")
                anime_instance.vector_rep = embedding
                updated_anime.append(anime_instance)
            else:
                print(f"No Anime found with unique_id {unique_id}. Skipping.")

        # Batch update instead of saving one by one
        if updated_anime:
            Anime.objects.bulk_update(updated_anime, ["vector_rep"])
            print(f"Successfully updated {len(updated_anime)} records.")

        print("Finished processing all records.")
