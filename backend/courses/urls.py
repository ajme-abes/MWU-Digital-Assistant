from django.urls import path
from .views import (
    CourseListCreateAPI,
    CourseDetailAPI,
    ResourceUploadAPI,
    EnrollAPI,  # Add this
    AssignmentAPI,
    EnrolledCoursesAPI,
    CourseStudentsAPI
)
urlpatterns = [
    path('courses/', CourseListCreateAPI.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetailAPI.as_view(), name='course-detail'),
    path('courses/<int:course_id>/resources/', ResourceUploadAPI.as_view(), name='resource-upload'),
    path('enroll/', EnrollAPI.as_view(), name='enroll'),
    path('courses/<int:course_id>/assignments/', AssignmentAPI.as_view(), name='assignment-list'),
    path('my-courses/', EnrolledCoursesAPI.as_view(), name='enrolled-courses'),
    path('courses/<int:course_id>/students/', CourseStudentsAPI.as_view(), name='course-students'),
]