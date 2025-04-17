# invitations/serializers.py
from rest_framework import serializers
from django.utils import timezone
from django.db import models
from .models import Invitation
from users.models import User
from university.models import Department
import uuid

class InvitationCreateSerializer(serializers.ModelSerializer):
    expiration_hours = serializers.IntegerField(
        write_only=True,
        default=72,
        min_value=1,
        max_value=168,
        help_text="Expiration time in hours (1-168)"
    )
    
    class Meta:
        model = Invitation
        fields = [
            'invitation_type', 
            'expiration_hours',
            'max_uses',
            'department'
        ]
        read_only_fields = ['code', 'created_by']
        extra_kwargs = {
            'department': {'required': True},
            'invitation_type': {'required': True}
        }

    def validate_department(self, value):
        user = self.context['request'].user
        if user.department != value or not user.is_hod:
            raise serializers.ValidationError(
                "You can only create invitations for your own department"
            )
        return value

    def create(self, validated_data):
        expiration_hours = validated_data.pop('expiration_hours')
        validated_data['code'] = uuid.uuid4().hex[:12].upper()
        validated_data['expires_at'] = timezone.now() + timezone.timedelta(
            hours=expiration_hours
        )
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class InvitationListSerializer(serializers.ModelSerializer):
    is_valid = serializers.BooleanField(read_only=True)
    department_name = serializers.CharField(
        source='department.name',
        read_only=True
    )

    class Meta:
        model = Invitation
        fields = [
            'id', 'code', 'invitation_type',
            'created_at', 'expires_at', 'max_uses',
            'used_count', 'is_valid', 'department_name'
        ]
        read_only_fields = fields