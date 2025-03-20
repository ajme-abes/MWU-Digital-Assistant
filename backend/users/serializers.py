# users/serializers.py
from rest_framework import serializers
from .models import User  # Ensure this import is correct

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username','email', 'password',  'role']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': False},
            'role': {'required': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            role=validated_data.get('role', 'student')
        )
        return user