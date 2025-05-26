from django.apps import AppConfig
import faiss
from django.conf import settings


class RecommendationsApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'recommendations_api'
    def ready(self):
        # Load the FAISS index once at startup
        settings.FAISS_INDEX = faiss.read_index(str(settings.FAISS_INDEX_FULL_PATH))