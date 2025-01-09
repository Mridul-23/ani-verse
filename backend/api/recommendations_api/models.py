from django.db import models
from django.contrib.auth.models import User


class UserRecommendationHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    arm = models.PositiveSmallIntegerField()
    recommended_shows = models.JSONField(default=list)
    ratings = models.JSONField(default=list)  # List of ratings corresponding to recommended shows
    t = models.PositiveIntegerField(default=1)  # Counter for updates


class UserSession(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    round_no = models.IntegerField(default=1)
    previous_arm = models.IntegerField(default=0)
    modified = models.BooleanField(default=False)

    def __str__(self):
        return f"Session for {self.user.username}"