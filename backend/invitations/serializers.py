from rest_framework import serializers
from .models import Invitation
from django.utils import timezone

class InvitationCreateSerializer(serializers.ModelSerializer):
    expiration_hours = serializers.IntegerField(
        write_only=True,
        default=72,
        min_value=1,
        max_value=168
    )

    class Meta:
        model = Invitation
        fields = ['invitation_type', 'expiration_hours', 'max_uses']
        read_only_fields = ['code', 'created_by', 'department']

    def create(self, validated_data):
        expiration_hours = validated_data.pop('expiration_hours')
        expires_at=timezone.now() + timezone.timedelta(
                hours=expiration_hours
            )

        #request = self.context['request']
        return Invitation.objects.create(
            **validated_data,
            expires_at=expires_at,
            department=self.context['request'].user.department,
            created_by=self.context['request'].user
            
        )

class InvitationListSerializer(serializers.ModelSerializer):
    is_valid = serializers.BooleanField(read_only=True)
    department = serializers.StringRelatedField()
    college = serializers.StringRelatedField(source='department.college')

    class Meta:
        model = Invitation
        fields = [
            'code', 'invitation_type', 'created_at', 'expires_at',
            'max_uses', 'used_count', 'is_valid', 'department', 'college'
        ]