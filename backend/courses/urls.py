# from django.urls import path
# from .views import (
#     CourseListCreateAPI,
#     CourseDetailAPI,
#     DepartmentResourceAPI,
#     EnrollAPI,  # Add this
#     AssignmentListCreateAPI,  # Add this
#     EnrolledCoursesAPI,
#     CourseStudentsAPI,
#     DepartmentCourseAPI,
#     HODResourceUploadAPI
# )
# urlpatterns = [
#     path('department/', DepartmentCourseAPI.as_view(), name='department-courses'),
#     path('hod/upload/<int:course_id>/resources/', HODResourceUploadAPI.as_view(), name='hod-resource-upload'),
#     path('', CourseListCreateAPI.as_view(), name='course-list'),
#     path('<int:pk>/', CourseDetailAPI.as_view(), name='course-detail'),
#     path('hod/<int:course_id>/resources/', 
#          HODResourceUploadAPI.as_view(), 
#          name='hod-resource-upload'),    
#     path('enroll/', EnrollAPI.as_view(), name='enroll'),
#     path('<int:course_id>/assignments/', AssignmentListCreateAPI.as_view(), name='assignment-list'),
#     path('enrolled/', EnrolledCoursesAPI.as_view(), name='enrolled-courses'),
#     path('<int:course_id>/students/', CourseStudentsAPI.as_view(), name='course-students'),
#     path(
#         'department/<uuid:department_id>/resources/',
#         DepartmentResourceAPI.as_view(),
#         name='department-resources'
#     ),
# ]
# course/urls.py
from django.urls import path
from .views import (
    CourseListCreateAPI,
    CourseDetailAPI,
    DepartmentResourceAPI,
    ResourceUploadAPI,
    AssignmentListCreateAPI,
    HODResourceUploadAPI
)



urlpatterns = [
    path('courses/', CourseListCreateAPI.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetailAPI.as_view(), name='course-detail'),
    path('courses/<int:course_id>/resources/upload/', 
         ResourceUploadAPI.as_view(), 
         name='resource-upload'),
    # Resource upload endpoints
    path('resources/upload/', ResourceUploadAPI.as_view(), name='resource-upload'),
    path('hod/resources/upload/<int:course_id>/', HODResourceUploadAPI.as_view(), name='hod-resource-upload'),
    
    # Other endpoints
    path('assignments/', AssignmentListCreateAPI.as_view(), name='assignment-list'),
    path('department/resources/', DepartmentResourceAPI.as_view(), name='department-resources'),
]