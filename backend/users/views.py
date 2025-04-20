from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from .models import User
from .serializers import (
    UserSerializer,
    StudentRegistrationSerializer,
    TeacherRegistrationSerializer,  # Make sure this exists
    LoginSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView

class StudentRegistrationView(CreateAPIView):
    """
    Allows student registration with valid invitation code
    POST /api/auth/signup/student/
    """
    serializer_class = StudentRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "message": "Student registered successfully",
            "department": user.department.code
        }, status=status.HTTP_201_CREATED)

class TeacherRegistrationView(CreateAPIView):
    """
    Allows teacher registration with valid invitation code
    POST /api/auth/signup/teacher/
    """
    serializer_class = TeacherRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "message": "Teacher registered successfully",
            "department": user.department.code
        }, status=status.HTTP_201_CREATED)

class CurrentUserView(APIView):
    """
    Get current authenticated user details
    GET /api/auth/me/
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer  # Add this line

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = User.objects.get(email=request.data['email'])
        response.data.update({
            'role': user.role,
            'department': user.department.code if user.department else None,
            'college': user.department.college.code if user.department else None
        })
        return response