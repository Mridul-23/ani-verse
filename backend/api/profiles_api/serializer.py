from .models import UserProfile

from rest_framework import serializers

from core.models import Anime


class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserProfile
        fields = '__all__'
    
    def get_pfp(self, obj):
        request = self.context.get('request')
        if obj.post_image:
            return request.build_absolute_uri(obj.pfp.url)
        return None
    
    # def get_favourite_anime(self, obj):
    #     return obj.name