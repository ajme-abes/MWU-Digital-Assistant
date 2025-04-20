# serializers.py
from rest_framework import serializers
from .models import Course, Resource, Enrollment, ResourceDownload, Assignment
from django.utils import timezone
from django.core.validators import FileExtensionValidator

class ResourceDownloadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceDownload
        fields = ['downloaded_at', 'device_info']
        read_only_fields = fields

class ResourceSerializer(serializers.ModelSerializer):
    status = serializers.CharField(read_only=True)
    approved_by = serializers.StringRelatedField(source='approved_by.email', read_only=True)
    uploaded_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    download_count = serializers.IntegerField(read_only=True)
    file_size = serializers.IntegerField(read_only=True)
    file_url = serializers.SerializerMethodField()
    versions = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'file', 'resource_type', 'description', 'status',
            'uploaded_by', 'approved_by', 'uploaded_at', 'download_count',
            'file_size', 'file_url', 'versions', 'is_active'
        ]
        read_only_fields = ['approved_by', 'uploaded_at', 'download_count']

    def get_file_url(self, obj):
        return obj.file.url if obj.file else None

    def get_versions(self, obj):
        return Resource.objects.filter(
            uuid__in=obj.previous_versions
        ).values('id', 'version', 'uploaded_at')

    def validate_file(self, value):
        if value.size > 1024 * 1024 * 100:  # 100MB
            raise serializers.ValidationError("File size exceeds 100MB limit")
        return value

    def create(self, validated_data):
        validated_data['status'] = 'pending'
        return super().create(validated_data)

class CourseSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    department_name = serializers.CharField(source='department.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.email', read_only=True)
    pending_approvals = serializers.SerializerMethodField()
    active_resources = serializers.SerializerMethodField()
    active_enrollments = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'code', 'description', 'teacher', 'department',
            'visibility', 'created_at', 'status', 'department_name',
            'teacher_name', 'pending_approvals', 'active_resources',
            'active_enrollments'
        ]
        read_only_fields = ['created_at', 'status']

    def get_status(self, obj):
        return {
            'students': obj.enrollment_set.filter(is_active=True).count(),
            'resources': obj.resources.filter(is_active=True).count(),
            'assignments': obj.course_assignments.count()
        }

    def get_pending_approvals(self, obj):
        return obj.resources.filter(status='pending', is_active=True).count()

    def get_active_resources(self, obj):
        return obj.resources.filter(is_active=True).count()

    def get_active_enrollments(self, obj):
        return obj.enrollment_set.filter(is_active=True).count()

class AssignmentSerializer(serializers.ModelSerializer):
    deadline = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    is_past_due = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = [
            'id', 'title', 'description', 'deadline', 'questions',
            'created_at', 'is_past_due'
        ]
        read_only_fields = ['created_at']

    def get_is_past_due(self, obj):
        return obj.deadline < timezone.now()

    def validate_deadline(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("Deadline must be in the future")
        return value

class ResourceApprovalSerializer(serializers.ModelSerializer):
    rejection_reason = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Resource
        fields = ['id', 'status', 'approved_by', 'rejection_reason']
        read_only_fields = ['approved_by']

    def update(self, instance, validated_data):
        user = self.context['request'].user
        rejection_reason = validated_data.pop('rejection_reason', None)
        
        if not (user == instance.course.teacher or user == instance.course.department.hod):
            raise serializers.ValidationError("Permission denied for resource approval")

        instance.status = validated_data.get('status', instance.status)
        instance.approved_by = user
        
        if instance.status == 'rejected':
            instance.rejection_reason = rejection_reason
            
        instance.save()
        return instance