from django.contrib import admin
from .models import Anime, Demographic, Genre, Studio, Rating, Source, TypeOf, UserProfile, SavedAnime, WatchLater, Comment, Picture, Character


class SavedAnimeAdmin(admin.ModelAdmin):
    list_display = ('user', 'anime', 'saved_at')
    readonly_fields = ('saved_at',)

class WatchLaterAdmin(admin.ModelAdmin):
    list_display = ('user', 'anime')

# class CommentAdmin(admin.ModelAdmin):
#     list_display = ()


# Register your models here.
admin.site.register(Anime)
admin.site.register(Demographic)
admin.site.register(Genre)
admin.site.register(Studio)
admin.site.register(Rating)
admin.site.register(Source)
admin.site.register(TypeOf)
admin.site.register(UserProfile)
admin.site.register(SavedAnime, SavedAnimeAdmin)
admin.site.register(WatchLater, WatchLaterAdmin)
admin.site.register(Comment)
admin.site.register(Picture)
admin.site.register(Character)