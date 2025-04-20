
from django.urls import path
from .views import InvitationCreateAPI, StudentManagementAPI
import university.views as views

urlpatterns = [
    path('invitations/', InvitationCreateAPI.as_view(), name='create-invitation'),
    path('students/<uuid:pk>/', StudentManagementAPI.as_view(), name='manage-student'),

    # College Endpoints
    path('colleges/', views.CollegeListCreateAPI.as_view(), name='college-list'),
    path('colleges/<int:pk>/', views.CollegeDetailAPI.as_view(), name='college-detail'),
    
    # Department Endpoints
    path('departments/', views.DepartmentListCreateAPI.as_view(), name='department-list'),
    path('departments/<int:pk>/', views.DepartmentDetailAPI.as_view(), name='department-detail'),
]