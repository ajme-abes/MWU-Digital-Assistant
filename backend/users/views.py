from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .models import User
from .serializers import (
    UserSerializer,
    StudentRegistrationSerializer,
    TeacherInvitationSerializer,
    CustomRegisterSerializer,
    SignupSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView

class StudentRegistrationView(generics.CreateAPIView):
    serializer_class = StudentRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Student registered successfully",
                "department": user.department.code
            },
            status=status.HTTP_201_CREATED
        )

class TeacherCreateView(generics.CreateAPIView):
    serializer_class = TeacherInvitationSerializer  # Updated name
    permission_classes = [permissions.IsAdminUser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Teacher created successfully",
                "department": user.department.code
            },
            status=status.HTTP_201_CREATED
        )

class CurrentUserAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class CustomRegisterView(generics.CreateAPIView):
    serializer_class = CustomRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )
    
class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        # Customize response if needed
        return response

class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = request.user
        response.data.update({
            'role': user.roles.first().name,
            'department': user.department.code if user.department else None,
            'college': user.college.code if user.college else None
        })
        return response