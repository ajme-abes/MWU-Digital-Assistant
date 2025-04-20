# # university/serializers.py
from rest_framework import serializers
from .models import College, Department
from invitations.models import Invitation  
from users.models import User

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ['id', 'name', 'code', 'established_date']
        read_only_fields = ['id']

# class DepartmentSerializer(serializers.ModelSerializer):
#     college = CollegeSerializer(read_only=True)
#     college_code = serializers.CharField(write_only=True)

#     class Meta:
#         model = Department
#         fields = ['id', 'name', 'code', 'college', 'college_code', 'hod']
#         read_only_fields = ['id', 'college']

#     def create(self, validated_data):
#         college_code = validated_data.pop('college_code')
#         college = College.objects.get(code=college_code)
#         return Department.objects.create(college=college, **validated_data)

class InvitationSerializer(serializers.ModelSerializer):
    is_valid = serializers.BooleanField(read_only=True)  # Add computed property
    
    class Meta:
        model = Invitation
        fields = ['id', 'code', 'department', 'created_by', 'expires_at', 
                 'max_uses', 'used_count', 'is_valid']
        read_only_fields = ['id', 'code', 'created_by', 'used_count', 'is_valid']

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'email', 'roles', 'department']
#         read_only_fields = ['id']

# Update university/serializers.py (remove old InvitationSerializer)
class DepartmentSerializer(serializers.ModelSerializer):
    college = CollegeSerializer(read_only=True)
    college_code = serializers.CharField(write_only=True)
    current_hod = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = [
            'id', 'name', 'code', 'college', 
            'college_code', 'hod', 'current_hod'
        ]
        read_only_fields = ['id', 'college', 'current_hod']

    def get_current_hod(self, obj):
        return obj.hod.email if obj.hod else None
    
    def create(self, validated_data):
        college_code = validated_data.pop('college_code')
        try:
            college = College.objects.get(pk=college_code)
        except College.DoesNotExist:
            raise serializers.ValidationError({"college_code": "College not found."})
        
        validated_data['college'] = college
        return super().create(validated_data)