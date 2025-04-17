# # courses/views.py
from django.shortcuts import  get_object_or_404
# from django.core.exceptions import MultipleObjectsReturned
# from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework.response import Response
from rest_framework.views import APIView
# from .permissions import IsDepartmentHOD


# # Import from current app (courses)
from .models import Course, Resource, Assignment, Enrollment
from .serializers import CourseSerializer, ResourceSerializer, AssignmentSerializer, HODResourceSerializer
from .permissions import (
    IsHOD,
    IsCourseTeacher,
    IsCourseTeacherInDepartment,
    IsDepartmentHOD,
    IsDepartmentMember
)
from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import ResourceApprovalSerializer
from rest_framework.exceptions import PermissionDenied
# from .permissions import IsCourseTeacherOrHOD, IsDepartmentHOD, IsDepartmentStudent, IsDepartmentMember, IsCourseTeacherInDepartment

# # Import from users app
# from users.models import User
# from users.serializers import UserSerializer  # <-- Add this line
# class CourseListCreateAPI(generics.ListCreateAPIView):
#     serializer_class = CourseSerializer
#     permission_classes = [permissions.IsAuthenticated, IsDepartmentHOD]


#     def get_queryset(self):
#         return Course.objects.filter(department=self.request.user.department)

#     def perform_create(self, serializer):
#         department = self.request.user.department
#         serializer.save(
#             department=department,
#             teacher=self.request.user
#         )

# class DepartmentCourseAPI(generics.ListAPIView):
#     serializer_class = CourseSerializer
#     permission_classes = [permissions.IsAuthenticated, IsDepartmentStudent]

#     def get_queryset(self):
#         return Course.objects.filter(
#             department=self.request.user.department,
#             visibility='public'
#         )


# class ResourceUploadAPI(APIView):
#     permission_classes = [IsAuthenticated, IsCourseTeacherInDepartment]
#     parser_classes = [MultiPartParser]

#     def post(self, request, course_id):
#         course = get_object_or_404(Course, pk=course_id)
#         serializer = ResourceSerializer(data=request.data)
        
#         if serializer.is_valid():
#             serializer.save(
#                 course=course,
#                 uploaded_by=request.user,
#                 department=course.department,
#                 status='pending'  # Add this line
#             )
#             return Response(serializer.data, status=201)
        
#         return Response(serializer.errors, status=400)

# class CourseDetailAPI(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = CourseSerializer
#     permission_classes = [permissions.IsAuthenticated, IsCourseTeacher]

#     def get_queryset(self):
#         return Course.objects.filter(teacher=self.request.user)

# class HODResourceUploadAPI(generics.CreateAPIView):
#     serializer_class = HODResourceSerializer
#     permission_classes = [permissions.IsAuthenticated, IsDepartmentHOD]
#     parser_classes = [MultiPartParser]

#     def perform_create(self, serializer):
#         course = get_object_or_404(
#             Course.objects.filter(department=self.request.user.department),
#             pk=self.kwargs['course_id']
#         )
#         serializer.save(
#             course=course,
#             uploaded_by=self.request.user
#         )

#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         context.update({'request': self.request})
#         return context
    
# class DepartmentResourceAPI(generics.ListAPIView):
#     serializer_class = ResourceSerializer
#     permission_classes = [permissions.IsAuthenticated, IsDepartmentMember]

#     def get_queryset(self):
#         return Resource.objects.filter(
#             department=self.request.user.department
#         ).select_related('course', 'uploaded_by')
# class EnrollAPI(generics.CreateAPIView):
#     permission_classes = [permissions.IsAuthenticated]
    
#     def create(self, request, *args, **kwargs):
#         # Auto-enroll department students in public courses
#         if request.user.department:
#             public_courses = Course.objects.filter(
#                 department=request.user.department,
#                 visibility='public'
#             )
#             for course in public_courses:
#                 Enrollment.objects.get_or_create(
#                     student=request.user,
#                     course=course
#                 )
        
#         # Handle private course enrollment with code
#         code = request.data.get('code')
#         if code:
#             try:
#                 course = Course.objects.get(enrollment_code=code)
#                 Enrollment.objects.get_or_create(
#                     student=request.user,
#                     course=course
#                 )
#             except Course.DoesNotExist:
#                 pass
                
#         return Response({'status': 'Enrollment processed'})


# class EnrolledCoursesAPI(generics.ListAPIView):
#     serializer_class = CourseSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Course.objects.filter(course_enrollments__student=self.request.user)

# class CourseStudentsAPI(generics.ListAPIView):
#     serializer_class = UserSerializer
#     permission_classes = [permissions.IsAuthenticated, IsCourseTeacher]

#     def get_queryset(self):
#         return User.objects.filter(
#             student_enrollments__course__id=self.kwargs['course_id']
#         )
    

# Update course/views.py
class ResourceUploadAPI(APIView):
    permission_classes = [IsAuthenticated, IsCourseTeacherInDepartment]
    parser_classes = [MultiPartParser]

    def post(self, request, course_id):
        course = get_object_or_404(Course, pk=course_id)
        serializer = ResourceSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(
                course=course,
                uploaded_by=request.user,
                department=course.department,
                status='pending'  # Add this line
            )
            return Response(serializer.data, status=201)
        
        return Response(serializer.errors, status=400)
class CourseListCreateAPI(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsDepartmentHOD]

    def get_queryset(self):
        # HOD can see all courses in their department
        return Course.objects.filter(
            department=self.request.user.department
        )

    def perform_create(self, serializer):
        # Auto-set department from HOD's department
        serializer.save(
            department=self.request.user.department,
            college=self.request.user.college
        )
class ResourceApprovalView(generics.UpdateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceApprovalSerializer
    permission_classes = [permissions.IsAuthenticated, IsHOD]

    def get_queryset(self):
        return Resource.objects.filter(
            course__department=self.request.user.department,
            status='pending'
        )

class HODCourseDashboard(generics.RetrieveAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsHOD]

    def get_object(self):
        return self.request.user.department

    def retrieve(self, request, *args, **kwargs):
        department = self.get_object()
        data = {
            'department': department.name,
            'courses': CourseSerializer(
                department.courses.all(),
                many=True,
                context={'request': request}
            ).data,
            'pending_approvals': Resource.objects.filter(
                course__department=department,
                status='pending'
            ).count()
        }
        return Response(data)
    
class HODResourceUploadAPI(generics.CreateAPIView):
    serializer_class = HODResourceSerializer
    permission_classes = [IsDepartmentHOD, IsDepartmentMember]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        # Get course from URL parameter
        course = generics.get_object_or_404(
            Course.objects.filter(department=self.request.user.department),
            pk=self.kwargs['course_id']
        )
        
        # Validate HOD's department matches course department
        if course.department != self.request.user.department:
            raise PermissionDenied("You can only upload resources to your own department's courses")

        # Save with context
        serializer.save(
            course=course,
            uploaded_by=self.request.user,
            status='approved'  # Auto-approve HOD uploads
        )

    def get_queryset(self):
        """Used for permission checks"""
        return Course.objects.filter(department=self.request.user.department)
    
class AssignmentListCreateAPI(generics.ListCreateAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsCourseTeacher]

    def get_queryset(self):
        return Assignment.objects.filter(course__teacher=self.request.user)

    def perform_create(self, serializer):
        course = get_object_or_404(
            Course.objects.filter(teacher=self.request.user),
            id=self.kwargs['course_id']
        )
        serializer.save(course=course)

class CourseDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsCourseTeacher]

    def get_queryset(self):
        """Only course teacher can modify/delete"""
        return Course.objects.filter(teacher=self.request.user)

    def perform_update(self, serializer):
        """Auto-update department from teacher's department"""
        serializer.save(department=self.request.user.department)

class DepartmentResourceAPI(generics.ListAPIView):
    """
    List all resources in the user's department
    URL: /api/courses/department/<department_id>/resources/
    """
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated, IsDepartmentMember]

    def get_queryset(self):
        return Resource.objects.filter(
            course__department=self.request.user.department
        ).select_related('course', 'uploaded_by')