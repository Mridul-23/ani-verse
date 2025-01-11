from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


class Anime(models.Model):
    unique_id = models.IntegerField(primary_key=True, unique=True)
    name = models.CharField(max_length=255, blank=True)
    name_english = models.CharField(max_length=255, blank=True)
    
    vector_rep = models.JSONField(default=list, null=True)

    # Statistics
    score = models.FloatField(null=True, blank=True)
    ranked = models.IntegerField(null=True, blank=True)
    members = models.IntegerField(null=True, blank=True)
    scored_by = models.FloatField(null=True, blank=True)
    favorites = models.IntegerField(null=True, blank=True)
    popularity = models.IntegerField(null=True, blank=True)

    # Descriptive fields
    synopsis = models.TextField(blank=True)
    aired = models.CharField(max_length=100, blank=True)
    duration_per_ep = models.CharField(max_length=100, blank=True)
    genre = models.ManyToManyField(to='Genre', blank=True )
    rating = models.ForeignKey(to='Rating', blank=True, on_delete=models.CASCADE, related_name='rating')
    studio = models.ForeignKey(to='Studio', blank=True, on_delete=models.CASCADE, related_name='studio')
    imagelink = models.TextField(default='un-available', blank=True)
    demographic = models.ForeignKey(to='Demographic', blank=True, on_delete=models.CASCADE, related_name='demography')

    # Categorical data
    total_episodes = models.FloatField(null=True, blank=True)
    premiered = models.CharField(max_length=100, blank=True)
    source = models.ForeignKey(to='Source', blank=True, on_delete=models.CASCADE, related_name='source')
    typeof = models.ForeignKey(to='TypeOf', blank=True, on_delete=models.CASCADE, related_name='typeof')

    # Engagement stats
    watching = models.IntegerField(null=True, blank=True)
    completed = models.IntegerField(null=True, blank=True)
    on_hold = models.IntegerField(null=True, blank=True)
    dropped = models.IntegerField(null=True, blank=True)
    plan_to_watch = models.IntegerField(null=True, blank=True)
    total = models.IntegerField(null=True, blank=True)

    # Scores
    scored_10_by = models.FloatField(null=True, blank=True)
    scored_9_by = models.FloatField(null=True, blank=True)
    scored_8_by = models.FloatField(null=True, blank=True)
    scored_7_by = models.FloatField(null=True, blank=True)
    scored_6_by = models.FloatField(null=True, blank=True)
    scored_5_by = models.FloatField(null=True, blank=True)
    scored_4_by = models.FloatField(null=True, blank=True)
    scored_3_by = models.FloatField(null=True, blank=True)
    scored_2_by = models.FloatField(null=True, blank=True)
    scored_1_by = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name


class Studio(models.Model):
    name = models.CharField(max_length=255, unique=True, default='Unknown Studio', blank=True)


class Demographic(models.Model):
    name = models.CharField(max_length=255, unique=True, default='Unknown Demographic', blank=True)


class Genre(models.Model):
    name = models.CharField(max_length=255, unique=True, default='Unknown Genre', blank=True)

class Rating(models.Model):
    name = models.CharField(max_length=255, unique=True, default='Unknown Rating', blank=True)


class Source(models.Model):
    name = models.CharField(max_length=255, unique=True, default='Unknown Source', blank=True)


class TypeOf(models.Model):
    name = models.CharField(max_length=255, unique=True, default='Unknown Type', blank=True)


class Picture(models.Model):
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE, related_name="pictures")
    url = models.URLField()


class Character(models.Model):
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE, related_name="characters")
    name = models.CharField(max_length=200)
    is_main = models.BooleanField(default=False)  # True for main characters

class Comment(models.Model):
    user = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    anime = models.ForeignKey(to='Anime', on_delete=models.CASCADE)
    comment = models.TextField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.username} commented on {self.anime.name}'

