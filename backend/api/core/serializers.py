from .models import UserProfile
from rest_framework import serializers


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

    def validate_age(self, value):
        if value < 1 or value > 100:
            raise serializers.ValidationError('Age must be between 1 and 100.')
        return value