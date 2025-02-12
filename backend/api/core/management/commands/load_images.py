import json
from django.core.management.base import BaseCommand
from core.models import Anime

class Command(BaseCommand):
    help = 'Bulk update anime images from a JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='Path to the JSON file containing anime images')

    def handle(self, *args, **kwargs):
        json_file = kwargs['json_file']
        update_count = 0
        skipped_entries = 0

        try:
            with open(json_file, encoding='utf-8') as file:
                anime_images = json.load(file)
        except (json.JSONDecodeError, FileNotFoundError) as e:
            self.stderr.write(f"❌ Error reading JSON file: {e}")
            return

        anime_name_map = {anime.name_english.strip(): anime for anime in Anime.objects.all()}

        for entry in anime_images:
            name_english = entry.get('name_english', '').strip()
            imagelink = (entry.get('img') or '').strip()

            if not name_english or not imagelink:
                self.stderr.write(f"⚠️ Skipping entry due to missing fields: {entry}")
                skipped_entries += 1
                continue

            if name_english in anime_name_map:
                Anime.objects.filter(name_english=name_english).update(imagelink=imagelink)
                self.stdout.write(f"✅ Updated image for: {name_english}")
                update_count += 1
            else:
                self.stderr.write(f"❌ No matching anime found for: {name_english}")

        self.stdout.write(f"\n🎉 Successfully updated {update_count} anime image URLs.")
        if skipped_entries:
            self.stderr.write(f"⚠️ Skipped {skipped_entries} entries due to missing fields.")
