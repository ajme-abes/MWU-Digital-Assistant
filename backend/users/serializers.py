from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import models
from invitations.models import Invitation  # Updated import
from university.models import Department

User = get_user_model()
# class StudentRegistrationSerializer(serializers.ModelSerializer):
#     invitation = serializers.UUIDField(write_only=True)

#     class Meta:
#         model = User
#         fields = ['email', 'password', 'invitation']
#         extra_kwargs = {'password': {'write_only': True}}

#     def validate_invitation(self, value):
#         try:
#             invitation = Invitation.objects.get(
#                 pk=value,
#                 expires_at__gt=timezone.now(),
#                 used_count__lt=models.F('max_uses')
#             )
#             return invitation
#         except Invitation.DoesNotExist:
#             raise serializers.ValidationError("Invalid or expired invitation code")

#     def create(self, validated_data):
#         invitation = validated_data.pop('invitation')
#         user = User.objects.create_user(
#             email=validated_data['email'],
#             password=validated_data['password'],
#             college=invitation.department.college,
#             department=invitation.department
#         )
#         invitation.used_count += 1
#         invitation.save()
#         return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'department']
        read_only_fields = ['id', 'role', 'department']
        extra_kwargs = {'password': {'write_only': True}}


# class TeacherCreateSerializer(serializers.ModelSerializer):
#     department_code = serializers.SlugRelatedField(
#         slug_field='code',
#         queryset=Department.objects.all(),
#         write_only=True
#     )

#     class Meta:
#         model = User
#         fields = ['email', 'password', 'department_code']
#         extra_kwargs = {'password': {'write_only': True}}

#     def create(self, validated_data):
#         department = validated_data.pop('department_code')
#         user = User.objects.create_user(
#             email=validated_data['email'],
#             password=validated_data['password'],
#             college=department.college,
#             department=department
#         )
#         return user
    
# class CustomRegisterSerializer(serializers.Serializer):
#      email = serializers.EmailField(required=True)
#      password1 = serializers.CharField(write_only=True, required=True)
#      password2 = serializers.CharField(write_only=True, required=True)

#      def validate(self, attrs):
#          if attrs['password1'] != attrs['password2']:
#              raise serializers.ValidationError({"password": "Passwords don't match"})
#          return attrs

#      def create(self, validated_data):
#          user = User.objects.create_user(
#              email=validated_data['email'],
#              password=validated_data['password1']
#          )
#          return user
     
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
# Update users/serializers.py
class StudentRegistrationSerializer(serializers.ModelSerializer):
    invitation = serializers.UUIDField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'invitation']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_invitation(self, value):
        try:
            return Invitation.objects.get(
                code=value,
                expires_at__gt=timezone.now(),
                used_count__lt=models.F('max_uses'),
                invitation_type='STUDENT'
            )
        except Invitation.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired student invitation code")

class TeacherInvitationSerializer(serializers.ModelSerializer):
    invitation = serializers.UUIDField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'invitation']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_invitation(self, value):
        try:
            return Invitation.objects.get(
                code=value,
                expires_at__gt=timezone.now(),
                used_count__lt=models.F('max_uses'),
                invitation_type='TEACHER'
            )
        except Invitation.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired teacher invitation code")

    def create(self, validated_data):
        invitation = validated_data.pop('invitation')
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            college=invitation.department.college,
            department=invitation.department,
            role='TEACHER'  # Replace with the appropriate value or import RoleChoices if it exists
        )
        invitation.used_count += 1
        invitation.save()
        return user
    
class CustomRegisterSerializer(serializers.ModelSerializer):
    invitation_code = serializers.CharField(write_only=True, required=False)
    role = serializers.ChoiceField(
        choices=[('STUDENT', 'Student'), ('TEACHER', 'Teacher')],
        write_only=True
    )

    class Meta:
        model = User
        fields = ['email', 'password', 'role', 'invitation_code']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
              raise serializers.ValidationError({"password": "Passwords don't match"})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password1']
        )
        return user
    
class SignupSerializer(serializers.ModelSerializer):
    invitation_code = serializers.CharField(
        write_only=True, 
        required=False,
        help_text="Required only for student registration"
    )
    role = serializers.ChoiceField(
        choices=[('STUDENT', 'Student'), ('TEACHER', 'Teacher')],
        write_only=True
    )

    class Meta:
        model = User
        fields = ['email', 'password', 'role', 'invitation_code']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        role = attrs.get('role')
        invitation_code = attrs.pop('invitation_code', None)

        if role == 'STUDENT' and not invitation_code:
            raise serializers.ValidationError(
                {"invitation_code": "Invitation code is required for student registration"}
            )

        if role == 'STUDENT':
            try:
                invitation = Invitation.objects.get(
                    code=invitation_code,
                    used_count__lt=models.F('max_uses'),
                    expires_at__gt=timezone.now()
                )
                attrs['department'] = invitation.department
                attrs['college'] = invitation.department.college
            except Invitation.DoesNotExist:
                raise serializers.ValidationError(
                    {"invitation_code": "Invalid or expired invitation code"}
                )

        return attrs

    def create(self, validated_data):
        role = validated_data.pop('role')
        user = User.objects.create_user(**validated_data)
        
        # Assign role
        role_obj, _ = Role.objects.get_or_create(
            name=role,
            department=user.department,
            college=user.college
        )
        user.roles.add(role_obj)
        
        return user