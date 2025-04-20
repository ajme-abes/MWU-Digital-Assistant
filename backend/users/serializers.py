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
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'id': self.user.id,
            'email': self.user.email,
            'role': self.user.role,
            'department': self.user.department.code if self.user.department else None,
            'college': self.user.department.college.code if self.user.department else None
        })
        return data
# class CustomRegisterSerializer(serializers.ModelSerializer):
#     invitation_code = serializers.CharField(write_only=True, required=False)
#     role = serializers.ChoiceField(
#         choices=[('STUDENT', 'Student'), ('TEACHER', 'Teacher')],
#         write_only=True
#     )

#     class Meta:
#         model = User
#         fields = ['email', 'password', 'role', 'invitation_code']
#         extra_kwargs = {'password': {'write_only': True}}

#     def validate(self, attrs):
#         if attrs['password1'] != attrs['password2']:
#               raise serializers.ValidationError({"password": "Passwords don't match"})
#         return attrs

#     def create(self, validated_data):
#         user = User.objects.create_user(
#             email=validated_data['email'],
#             password=validated_data['password1']
#         )
#         return user
    
# class SignupSerializer(serializers.ModelSerializer):
#     invitation_code = serializers.CharField(
#         write_only=True, 
#         required=False,
#         help_text="Required only for student registration"
#     )
#     role = serializers.ChoiceField(
#         choices=[('STUDENT', 'Student'), ('TEACHER', 'Teacher')],
#         write_only=True
#     )

#     class Meta:
#         model = User
#         fields = ['email', 'password', 'role', 'invitation_code']
#         extra_kwargs = {'password': {'write_only': True}}

#     def validate(self, attrs):
#         role = attrs.get('role')
#         invitation_code = attrs.pop('invitation_code', None)

#         if role == 'STUDENT' and not invitation_code:
#             raise serializers.ValidationError(
#                 {"invitation_code": "Invitation code is required for student registration"}
#             )

#         if role == 'STUDENT':
#             try:
#                 invitation = Invitation.objects.get(
#                     code=invitation_code,
#                     used_count__lt=models.F('max_uses'),
#                     expires_at__gt=timezone.now()
#                 )
#                 attrs['department'] = invitation.department
#                 attrs['college'] = invitation.department.college
#             except Invitation.DoesNotExist:
#                 raise serializers.ValidationError(
#                     {"invitation_code": "Invalid or expired invitation code"}
#                 )

#         return attrs

#     def create(self, validated_data):
#         role = validated_data.pop('role')
#         user = User.objects.create_user(**validated_data)
        
#         # Assign role
#         role_obj, _ = Role.objects.get_or_create(
#             name=role,
#             department=user.department,
#             college=user.college
#         )
#         user.roles.add(role_obj)
        
#         return user