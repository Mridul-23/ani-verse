from django.db import models
from django.contrib.auth.models import User


class UserRecommendationHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    arm = models.PositiveSmallIntegerField()
    recommended_shows = models.ManyToManyField('core.GeneralData', related_name='recommended_shows')
    ratings = models.JSONField(default=list)  # List of ratings corresponding to recommended shows
    t = models.PositiveIntegerField(default=1)  # Counter for updates