from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter
from django.shortcuts import get_object_or_404
from django.db import models, transaction
from .models import Course, Resource, Enrollment, ResourceDownload, Assignment
from .serializers import (
    CourseSerializer, 
    ResourceSerializer,
    ResourceApprovalSerializer,
    AssignmentSerializer,
    ResourceDownloadSerializer
)
from .permissions import (
    IsDepartmentHOD,
    IsCourseTeacher,
    IsDepartmentMember,
    IsCourseTeacher,
    IsHOD,
    IsTeacher,
)

class ResourceUploadAPI(APIView):
    permission_classes = [IsAuthenticated, IsCourseTeacher]
    parser_classes = [MultiPartParser]
    throttle_scope = 'resource_upload'

    def post(self, request, course_id):
        # Get course with department prefetch
        course = get_object_or_404(
            Course.objects.select_related('department'),
            pk=course_id,
            department=request.user.department
        )
        
        # Validate request data
        serializer = ResourceSerializer(
            data=request.data,
            context={'request': request, 'course': course}
        )
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            with transaction.atomic():
                # Create resource
                resource = serializer.save(
                    course=course,
                    uploaded_by=request.user,
                    status=self._get_initial_status(request.user, course)
                )
                
                # Record download activity
                self._create_download_record(request, resource)
                
                return Response(
                    ResourceSerializer(resource).data,
                    status=status.HTTP_201_CREATED
                )
                
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _get_initial_status(self, user, course):
        """Determine initial approval status"""
        if user == course.department.hod or user == course.teacher:
            return 'approved'
        return 'pending'

    def _create_download_record(self, request, resource):
        """Create initial download audit entry"""
        ResourceDownload.objects.create(
            resource=resource,
            user=request.user,
            device_info={
                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                'ip_address': request.META.get('REMOTE_ADDR', ''),
                'platform': request.user_agent.os.family if request.user_agent else 'Unknown'
            }
        )
class CourseListCreateAPI(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['visibility', 'teacher']
    search_fields = ['title', 'code']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsHOD()]  # Only HOD can create courses
        return [IsAuthenticated()]  # All authenticated can list
    
    def get_queryset(self):
        user = self.request.user
        return Course.objects.filter(
            department=user.department
        ).select_related('teacher', 'department')
    
    def perform_create(self, serializer):
        serializer.save(department=self.request.user.department)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "count": queryset.count(),
            "results": serializer.data
        })

class ResourceApprovalView(generics.UpdateAPIView):
    queryset = Resource.objects.filter(is_active=True)
    serializer_class = ResourceApprovalSerializer
    permission_classes = [IsDepartmentHOD]
    throttle_scope = 'resource_approval'

    def get_queryset(self):
        return super().get_queryset().filter(
            course__department=self.request.user.department,
            status='pending'
        ).select_related('course', 'uploaded_by')

    def perform_update(self, serializer):
        instance = self.get_object()
        user = self.request.user
        
        # Track previous versions before approval
        if serializer.validated_data.get('status') == 'approved':
            instance.previous_versions.append(instance.id)
            instance.version += 1
        
        serializer.save(approved_by=user, approved_at=timezone.now())

class HODCourseDashboard(generics.RetrieveAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsDepartmentHOD]

    def get_object(self):
        return self.request.user.department

    def retrieve(self, request, *args, **kwargs):
        department = self.get_object()
        courses = department.courses.filter(is_active=True)
        
        data = {
            'department': department.name,
            'active_courses': CourseSerializer(
                courses,
                many=True,
                context={'request': request}
            ).data,
            'metrics': {
                'pending_approvals': Resource.objects.filter(
                    course__department=department,
                    status='pending',
                    is_active=True
                ).count(),
                'active_students': Enrollment.objects.filter(
                    course__department=department,
                    is_active=True
                ).count(),
                'storage_usage': Resource.objects.filter(
                    course__department=department
                ).aggregate(total=models.Sum('file_size'))['total'] or 0
            }
        }
        return Response(data)

class HODResourceUploadAPI(generics.CreateAPIView):
    serializer_class = ResourceSerializer
    permission_classes = [IsDepartmentHOD, IsDepartmentMember]
    parser_classes = [MultiPartParser, FormParser]
    throttle_scope = 'hod_upload'

    def perform_create(self, serializer):
        course = get_object_or_404(
            Course.objects.filter(department=self.request.user.department),
            pk=self.kwargs['course_id']
        )
        
        resource = serializer.save(
            course=course,
            uploaded_by=self.request.user,
            status='approved'
        )
        
        # Log initial download
        ResourceDownload.objects.create(
            resource=resource,
            user=self.request.user,
            device_info={
                'user_agent': self.request.META.get('HTTP_USER_AGENT'),
                'ip_address': self.request.META.get('REMOTE_ADDR')
            }
        )

class AssignmentListCreateAPI(generics.ListCreateAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsCourseTeacher]
    filterset_fields = ['course', 'deadline']
    ordering_fields = ['deadline', 'created_at']

    def get_queryset(self):
        return Assignment.objects.filter(
            course__teacher=self.request.user
        ).select_related('course')

    def perform_create(self, serializer):
        course = get_object_or_404(
            Course.objects.filter(teacher=self.request.user),
            id=self.kwargs['course_id']
        )
        serializer.save(course=course)

class CourseDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsCourseTeacher]
    lookup_field = 'id'

    def get_queryset(self):
        return Course.objects.filter(
            teacher=self.request.user,
            is_active=True
        ).select_related('department')

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()
        
        # Soft-delete related resources
        Resource.objects.filter(course=instance).update(is_active=False)

class DepartmentResourceAPI(generics.ListAPIView):
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated, IsDepartmentMember]
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['course', 'resource_type']
    search_fields = ['title', 'description']

    def get_queryset(self):
        return Resource.objects.filter(
            course__department=self.request.user.department,
            is_active=True
        ).select_related('course', 'uploaded_by').prefetch_related('downloads')

class ResourceDownloadView(generics.RetrieveAPIView):
    queryset = Resource.objects.filter(is_active=True)
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ResourceDownloadSerializer

    def retrieve(self, request, *args, **kwargs):
        resource = self.get_object()
        
        # Record download
        ResourceDownload.objects.create(
            resource=resource,
            user=request.user,
            device_info={
                'user_agent': request.META.get('HTTP_USER_AGENT'),
                'ip_address': request.META.get('REMOTE_ADDR')
            }
        )
        
        # Update download count
        resource.download_count += 1
        resource.save(update_fields=['download_count'])
        
        return Response({
            'download_url': resource.file.url,
            'remaining_downloads': resource.max_downloads - resource.download_count
        })