from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from profiles_api.models import UserProfile


# Create a UserProfile whenever a User is created
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)