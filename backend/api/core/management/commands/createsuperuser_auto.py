from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import os

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(
                "Admin",
                "mridulnarula23@gmail.com",
                os.environ.get("DJANGO_SUPERUSER_PASSWORD", "admin123")
            )
            print("Superuser created.")
        else:
            print("Superuser already exists.")
