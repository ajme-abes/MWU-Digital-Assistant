from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from datetime import timedelta
import uuid
from django.contrib.auth import get_user_model
from rest_framework import generics
from .models import College, Department
from .serializers import CollegeSerializer, DepartmentSerializer
User = get_user_model()


from invitations.models import Invitation
from .serializers import InvitationSerializer
from users.permissions import IsDepartmentHOD, ManagesDepartment

class InvitationCreateAPI(generics.CreateAPIView):
    serializer_class = InvitationSerializer
    permission_classes = [permissions.IsAuthenticated, IsDepartmentHOD]

    def perform_create(self, serializer):
        from invitations.models import Invitation
        department = self.request.user.department
        serializer.save(
            department=department,
            created_by=self.request.user,
            code=uuid.uuid4().hex[:24],  # Generate random code
            expires_at=timezone.now() + timedelta(days=3)
        )

class StudentManagementAPI(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsDepartmentHOD, ManagesDepartment]
    
    def get_queryset(self):
        return User.objects.filter(
            roles__name='STUDENT',
            department=self.request.user.department
        )
    def perform_destroy(self, instance):
        if instance.department != self.request.user.department:
            raise PermissionDenied("Cannot delete students from other departments")
        instance.delete()

class CollegeListCreateAPI(generics.ListCreateAPIView):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    permission_classes = [IsAdminUser]

class CollegeDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    permission_classes = [IsAdminUser]

class DepartmentListCreateAPI(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminUser]

class DepartmentDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminUser]