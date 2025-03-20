from rest_framework import serializers
from .models import Course, Resource
from rest_framework import serializers
from .models import Course, Resource, Assignment  # Import Assignment
#apis fro course&resource
class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'file', 'resource_type', 'uploaded_at']

class CourseSerializer(serializers.ModelSerializer):
    resources = ResourceSerializer(many=True, read_only=True)
    teacher = serializers.ReadOnlyField(source='teacher.username')

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'teacher', 'visibility', 'enrollment_code', 'resources']


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'description', 'deadline', 'questions']