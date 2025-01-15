from django.db import models
from django.conf import settings

from rest_framework.exceptions import ValidationError

from core.models import Anime



class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    age = models.IntegerField(blank=True, default=1)
    name = models.CharField(max_length=50, blank=True)
    bio = models.CharField(max_length=100, blank=True)
    pfp = models.ImageField(upload_to='profile_pictures/', blank=True)
    favourite_anime = models.OneToOneField(Anime, on_delete=models.CASCADE, blank=True, null=True)

    REQUIRED_FIELDS = ['age']

    def clean(self):
        if self.age < 1 or self.age > 100:
            raise ValidationError({'error': 'Age must be between 1 and 100.'})

    def save(self, *args, **kwargs):
        self.clean()
        if not self.name:
            self.name = self.user.username
        super().save(*args, **kwargs)



class SavedAnime(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'anime'], name='unique_saved_anime')
        ]
    
    def __str__(self):
        return f'{self.user.username} - {self.anime.name}'


class WatchLater(models.Model):
    user = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'anime'], name='unique_watch_later')
        ]
