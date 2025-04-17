
from django.urls import path
from .views import InvitationCreateAPI, StudentManagementAPI

urlpatterns = [
    path('invitations/', InvitationCreateAPI.as_view(), name='create-invitation'),
    path('students/<uuid:pk>/', StudentManagementAPI.as_view(), name='manage-student'),
]