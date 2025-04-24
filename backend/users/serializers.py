from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import models
from invitations.models import Invitation  # Updated import
from university.models import Department
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    department = serializers.StringRelatedField()
    college = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'department', 'college']
        read_only_fields = ['id', 'role', 'department', 'college']

    def get_college(self, obj):
        return obj.department.college.name if obj.department else None
class BaseRegistrationSerializer(serializers.ModelSerializer):
    code = serializers.CharField(write_only=True, max_length=12)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'password', 'code']

class StudentRegistrationSerializer(BaseRegistrationSerializer):
    def validate_code(self, value):
        try:
            invitation = Invitation.objects.get(
                code=value,
                invitation_type='STUDENT',
                expires_at__gt=timezone.now(),
                used_count__lt=models.F('max_uses')
            )
            self.context['invitation'] = invitation
            return value
        except Invitation.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired student invitation code")

    def create(self, validated_data):
        invitation = self.context['invitation']
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role='STUDENT',
            department=invitation.department
        )
        invitation.used_count += 1
        invitation.save()
        return user


class TeacherRegistrationSerializer(BaseRegistrationSerializer):
    def validate_code(self, value):
        try:
            invitation = Invitation.objects.get(
                code=value,
                invitation_type='TEACHER',
                expires_at__gt=timezone.now(),
                used_count__lt=models.F('max_uses')
            )
            self.context['invitation'] = invitation
            return value
        except Invitation.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired teacher invitation code")

    def create(self, validated_data):
        invitation = self.context['invitation']
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role='TEACHER',
            department=invitation.department
        )
        invitation.used_count += 1
        invitation.save()
        return user
class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # ✅ Embed custom fields in the token
        token['role'] = user.role
        token['email'] = user.email
        token['department'] = user.department.code if user.department else None
        token['college'] = user.department.college.code if user.department and user.department.college else None

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Optional: Also return user info in the response body
        data.update({
            'id': self.user.id,
            'email': self.user.email,
            'role': self.user.role,
            'department': self.user.department.code if self.user.department else None,
            'college': self.user.department.college.code if self.user.department else None
        })

        return data

