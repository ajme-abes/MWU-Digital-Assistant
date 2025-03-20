# courses/views.py
from django.shortcuts import render
from django.core.exceptions import MultipleObjectsReturned
from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

# Import from current app (courses)
from .models import Course, Resource, Assignment, Enrollment
from .serializers import CourseSerializer, ResourceSerializer, AssignmentSerializer
from .permissions import IsTeacher

# Import from users app
from users.models import User
from users.serializers import UserSerializer

class CourseListCreateAPI(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

class CourseDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

class ResourceUploadAPI(generics.CreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def perform_create(self, serializer):
        course_id = self.kwargs['course_id']
        course = Course.objects.get(id=course_id)
        serializer.save(course=course)

class EnrollAPI(APIView):
    def post(self, request):
        code = request.data.get('code')
        try:
            course = Course.objects.get(enrollment_code=code)
            # ... existing enrollment logic ...
        except MultipleObjectsReturned:
            return Response(
                {"error": "Multiple courses found with this code. Contact admin."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Course.DoesNotExist:
            return Response({"error": "Invalid code"}, status=status.HTTP_400_BAD_REQUEST)

class AssignmentAPI(generics.ListCreateAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Assignment.objects.filter(course__id=course_id)

    def perform_create(self, serializer):
        course = Course.objects.get(id=self.kwargs['course_id'])
        serializer.save(course=course)

class EnrolledCoursesAPI(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Course.objects.filter(enrollments__student=self.request.user)

class CourseStudentsAPI(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return User.objects.filter(enrollments__course__id=course_id)