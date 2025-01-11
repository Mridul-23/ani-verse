import json
from django.core.management.base import BaseCommand
from core.models import Anime

class Command(BaseCommand):
    help = 'Update image links in Anime from JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='Path to the JSON file')

    def handle(self, *args, **kwargs):
        json_file = kwargs['json_file']
        
        # Load JSON data
        with open(json_file, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Track the number of updates
        updates = 0

        for entry in data:
            name_english = entry['name_english']
            img_link = entry['img']

            if img_link == None:
                continue

            # Find all matching Anime objects and update them
            general_data_entries = Anime.objects.filter(name_english=name_english)
            if general_data_entries.exists():
                for general_data in general_data_entries:
                    general_data.imagelink = img_link
                    general_data.save()
                    updates += 1
                    self.stdout.write(self.style.SUCCESS(f'Updated {name_english} with link {img_link}'))
            else:
                self.stdout.write(self.style.WARNING(f'{name_english} not found in database'))

        self.stdout.write(self.style.SUCCESS(f'Successfully updated {updates} records'))