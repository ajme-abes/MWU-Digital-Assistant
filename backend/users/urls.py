
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    StudentRegistrationView,
    TeacherRegistrationView,
    CurrentUserView,
    LoginView,
    
)

app_name = 'users'
urlpatterns = [
    # Authentication
    path('signup/student/', StudentRegistrationView.as_view(), name='student-signup'),
    path('signup/teacher/', TeacherRegistrationView.as_view(), name='teacher-signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),  # Fixed this line
    path('user/', CurrentUserView.as_view(), name='current-user'),
]