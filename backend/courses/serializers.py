

# from rest_framework import serializers
# from django.utils import timezone
from .models import Course, Resource, Assignment
# from university.models import Department
# from users.models import User

# class ResourceSerializer(serializers.ModelSerializer):
#     uploaded_by = serializers.StringRelatedField(source='uploaded_by.email')
#     file_url = serializers.SerializerMethodField()

#     class Meta:
#         model = Resource
#         fields = [
#             'id', 'title', 'file_url', 'resource_type', 
#             'description', 'uploaded_at', 'uploaded_by'
#         ]
#         read_only_fields = ['uploaded_at', 'uploaded_by']

#     def get_file_url(self, obj):
#         return self.context['request'].build_absolute_uri(obj.file.url)

# class CourseSerializer(serializers.ModelSerializer):
#     resources = ResourceSerializer(many=True, read_only=True)
#     teacher = serializers.SlugRelatedField(
#         slug_field='email',
#         queryset=User.objects.filter(roles__name='FACULTY')
#     )
#     department = serializers.SlugRelatedField(
#         slug_field='code',
#         queryset=Department.objects.all()
#     )
#     enrollment_count = serializers.SerializerMethodField()
#     is_hod = serializers.SerializerMethodField()

#     class Meta:
#         model = Course
#         fields = [
#             'id', 'title', 'description', 'teacher', 'department',
#             'visibility', 'enrollment_code', 'created_at', 'updated_at',
#             'resources', 'enrollment_count', 'is_hod'
#         ]
#         read_only_fields = [
#             'enrollment_code', 'created_at', 'updated_at', 
#             'resources', 'enrollment_count', 'is_hod'
#         ]

#     def get_enrollment_count(self, obj):
#         return obj.course_enrollments.count()

#     def get_is_hod(self, obj):
#         request = self.context.get('request')
#         return request.user == obj.department.hod if request else False

# class HODResourceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Resource
#         fields = ['title', 'file', 'resource_type', 'description']
#         extra_kwargs = {
#             'file': {'required': True},
#             'resource_type': {'required': True}
#         }

#     def validate(self, attrs):
#         if attrs['resource_type'] == 'quiz' and not attrs.get('description'):
#             raise serializers.ValidationError("Quizzes require a description")
#         return attrs

# class AssignmentSerializer(serializers.ModelSerializer):
#     deadline = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
#     is_past_due = serializers.SerializerMethodField()

#     class Meta:
#         model = Assignment
#         fields = ['id', 'title', 'description', 'deadline', 'questions', 'created_at', 'is_past_due']
#         read_only_fields = ['created_at']

#     def get_is_past_due(self, obj):
#         return obj.deadline < timezone.now()

# Update course/serializers.py
from rest_framework import serializers
from .models import Course, Resource
from django.utils import timezone

class ResourceSerializer(serializers.ModelSerializer):
    status = serializers.CharField(read_only=True)
    approved_by = serializers.StringRelatedField(source='approved_by.email', read_only=True)
    uploaded_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'file', 'resource_type', 'description',
            'status', 'uploaded_by', 'approved_by', 'uploaded_at'
        ]
        read_only_fields = ['approved_by', 'uploaded_at']

    def create(self, validated_data):
        validated_data['status'] = 'pending'
        return super().create(validated_data)

class HODResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['title', 'file', 'resource_type', 'description']
        extra_kwargs = {
            'file': {'required': True},
            'resource_type': {'required': True}
        }

    def validate(self, attrs):
        """Additional validation for HOD-uploaded resources"""
        if attrs['resource_type'] == 'quiz' and not attrs.get('description'):
            raise serializers.ValidationError(
                "Quizzes require a description"
            )
        return attrs
class CourseSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    department_name = serializers.CharField(source='department.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.email', read_only=True)
    pending_approvals = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'code', 'description', 'teacher', 'department',
            'visibility', 'enrollment_code', 'created_at', 'status',
            'department_name', 'teacher_name', 'pending_approvals'
        ]
        read_only_fields = ['enrollment_code', 'created_at', 'status']

    def get_status(self, obj):
        request = self.context.get('request')
        if request and request.user == obj.department.hod:
            return {
                'student_count': obj.enrollments.count(),
                'resource_count': obj.resources.count(),
                'assignment_count': obj.assignments.count()
            }
        return None

    def get_pending_approvals(self, obj):
        if self.context.get('request').user == obj.department.hod:
            return obj.resources.filter(status='pending').count()
        return 0

class AssignmentSerializer(serializers.ModelSerializer):
    deadline = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    is_past_due = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = [
            'id', 'title', 'description', 
            'deadline', 'questions', 'created_at', 
            'is_past_due'
        ]
        read_only_fields = ['created_at']

    def get_is_past_due(self, obj):
        return obj.deadline < serializers.DateTimeField().to_representation(timezone.now())
    
class ResourceApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'status', 'approved_by']
        read_only_fields = ['approved_by']

    def update(self, instance, validated_data):
        user = self.context['request'].user
        if user != instance.course.department.hod:
            raise serializers.ValidationError("Only HOD can approve resources")
        
        instance.status = validated_data.get('status', instance.status)
        instance.approved_by = user
        instance.save()
        return instance


