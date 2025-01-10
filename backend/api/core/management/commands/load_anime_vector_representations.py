import json
import pandas as pd
from django.core.management.base import BaseCommand
from core.models import Anime

class Command(BaseCommand):
    help = 'Load anime data from JSON file into the database'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='Path to the JSON file')

    def handle(self, **kwargs):
        json_file = kwargs['json_file']

        # Load the JSON data using pandas (since it was created with pd.to_json())
        data = pd.read_json(json_file)

        # Convert the pandas DataFrame to a list of dictionaries (one per row)
        data_dict = data.to_dict(orient='records')

        for row in data_dict:
            unique_id = int(row['unique_id'])
            print(f"Processing unique_id: {unique_id}")

            # Check if the anime with unique_id exists in the database
            if Anime.objects.filter(unique_id=unique_id).exists():
                try:
                    # Fetch the Anime object using the unique_id
                    general_data = Anime.objects.get(unique_id=unique_id)
                    print(f"Found anime: {general_data.name}")

                    # Ensure 'embedding' is a valid key in the row
                    if 'embedding' in row:
                        general_data.vector_rep = row['embedding']
                        general_data.save()  # Save the changes
                    else:
                        print(f"Embedding not found for unique_id {unique_id}")
                except Anime.DoesNotExist:
                    print(f"Anime with unique_id {unique_id} does not exist.")
            else:
                print(f"No Anime found with unique_id {unique_id} Skipping.")
                break

        print("Finished processing all records.")
