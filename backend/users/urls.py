# from django.urls import path, include
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from .views import (
#     StudentRegistrationView,
#     TeacherCreateView,
#     CurrentUserAPI,
#     CustomRegisterView
# )

# app_name = 'users'
# urlpatterns = [
#     # Authentication
#     path('signup/student/', StudentRegistrationView.as_view(), name='student-signup'),
#     path('signup/teacher/', TeacherCreateView.as_view(), name='teacher-signup'),
#     path('signup/', CustomRegisterView.as_view(), name='general-signup'),
#     path('login/', TokenObtainPairView.as_view(), name='login'),
#     path('token/refresh/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('user/', CurrentUserAPI.as_view(), name='current-user'),
# ]

# users/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    StudentRegistrationView,
    TeacherCreateView,
    CurrentUserAPI,
    CustomRegisterView
)

app_name = 'users'
urlpatterns = [
    # Authentication
    path('signup/student/', StudentRegistrationView.as_view(), name='student-signup'),
    path('signup/teacher/', TeacherCreateView.as_view(), name='teacher-signup'),
    path('signup/', CustomRegisterView.as_view(), name='general-signup'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),  # Fixed this line
    path('user/', CurrentUserAPI.as_view(), name='current-user'),
]