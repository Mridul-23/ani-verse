from django.contrib import admin

from .models import UserProfile, SavedAnime, WatchLater



class SavedAnimeAdmin(admin.ModelAdmin):
    list_display = ('user', 'anime', 'saved_at')
    readonly_fields = ('saved_at',)

class WatchLaterAdmin(admin.ModelAdmin):
    list_display = ('user', 'anime')


admin.site.register(UserProfile)
admin.site.register(SavedAnime, SavedAnimeAdmin)
admin.site.register(WatchLater, WatchLaterAdmin)