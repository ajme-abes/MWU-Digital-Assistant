# from rest_framework import permissions

# class IsCourseTeacher(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         # Check if user is the course teacher
#         return obj.teacher == request.user
# class IsCourseTeacherOrHOD(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         # Inherit from IsCourseTeacher check
#         if IsCourseTeacher().has_object_permission(request, view, obj):
#             return True
            
#         # Check HOD status
#         try:
#             return obj.department.hod == request.user
#         except AttributeError:
#             return False
        
# class IsDepartmentHOD(permissions.BasePermission):
#     def has_permission(self, request, view):
#         return request.user.roles.filter(
#             name='HOD',
#             department=request.user.department
#         ).exists()

# class IsDepartmentStudent(permissions.BasePermission):
#     def has_permission(self, request, view):
#         return request.user.roles.filter(
#             name='STUDENT',
#             department=request.user.department
#         ).exists()
    

# class IsDepartmentMember(permissions.BasePermission):
#     """
#     Allows access only to users belonging to the object's department.
#     """
#     def has_object_permission(self, request, view, obj):
#         # For model instances with department field
#         if hasattr(obj, 'department'):
#             return request.user.department == obj.department
        
#         # For department-based views
#         department_id = view.kwargs.get('department_id')
#         return str(request.user.department.id) == department_id
    
# class IsCourseTeacherInDepartment(permissions.BasePermission):
#     def has_permission(self, request, view):
#         # Get course from view or request data
#         course_id = view.kwargs.get('course_id') or request.data.get('course')
#         course = Course.objects.get(pk=course_id)
#         return request.user.department == course.department

# course/permissions.py
from rest_framework import permissions
from core.permissions import IsHOD, IsTeacher, SameDepartment
from core.permissions import RoleChoices


class IsCourseTeacher(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.teacher == request.user

class CourseAccessPolicy(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == 'create':
            return IsTeacher().has_permission(request, view)
        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ['update', 'partial_update', 'destroy']:
            return IsCourseTeacher().has_object_permission(request, view, obj)
        return SameDepartment().has_object_permission(request, view, obj)

class ResourceApprovalPermission(IsHOD, SameDepartment):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.course)
    
class IsCourseTeacherInDepartment(IsTeacher):
    """Verify user is a teacher in the same department as the course"""
    
    def has_permission(self, request, view):
        # First check if user is a teacher
        if not super().has_permission(request, view):
            return False
            
        # Get department from request data or URL
        department_id = (
            request.data.get('department') or 
            view.kwargs.get('department_id')
        )
        
        # Check teacher's department matches
        return str(request.user.department.id) == str(department_id)

    def has_object_permission(self, request, view, obj):
        # For object-level permissions
        return (
            super().has_object_permission(request, view, obj) and
            obj.department == request.user.department
        )
    
class IsDepartmentHOD(permissions.BasePermission):
    """Verify user is HOD of their department"""
    
    def has_permission(self, request, view):
        # Check role and department assignment
        return (
            request.user.role == RoleChoices.HOD and
            request.user.department is not None
        )

    def has_object_permission(self, request, view, obj):
        # Check object's department matches HOD's department
        return obj.department == request.user.department

class IsDepartmentMember(permissions.BasePermission):
    """Verify user belongs to the object's department"""
    
    def has_object_permission(self, request, view, obj):
        # Works for any model with 'department' field
        return obj.department == request.user.department