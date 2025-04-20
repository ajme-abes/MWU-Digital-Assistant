# core/permissions.py
from rest_framework import permissions
from django.db import models

class RoleChoices(models.TextChoices):
    ADMIN = 'ADMIN', 'Administrator'
    HOD = 'HOD', 'Head of Department'
    TEACHER = 'TEACHER', 'Teacher'
    STUDENT = 'STUDENT', 'Student'
    PRINCIPAL = 'PRINCIPAL', 'Principal'
    LIBRARY = 'LIBRARY', 'Library Staff'
    FINANCE = 'FINANCE', 'Finance Officer'

class BaseRolePermission(permissions.BasePermission):
    role = None  # To be defined in subclasses
    
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role == self.role
        )

class IsAdmin(BaseRolePermission):
    role = RoleChoices.ADMIN

class IsHOD(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == RoleChoices.HOD and
            request.user.department is not None
        )
    
    def has_object_permission(self, request, view, obj):
        return obj.department == request.user.department

class IsTeacher(BaseRolePermission):
    role = RoleChoices.TEACHER

class IsStudent(BaseRolePermission):
    role = RoleChoices.STUDENT

class IsCourseTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        course_id = view.kwargs.get('course_id') or request.data.get('course_id')
        if not course_id:
            return False
            
        return request.user.role == RoleChoices.TEACHER and \
               request.user.taught_courses.filter(id=course_id).exists()
class SameCollege(permissions.BasePermission):
    """
    Allows access only if user and object belong to same college
    """
    def has_object_permission(self, request, view, obj):
        return obj.college == request.user.college

class SameDepartment(permissions.BasePermission):
    """
    Allows access only if user and object belong to same department
    """
    def has_object_permission(self, request, view, obj):
        return obj.department == request.user.department
class CollegeLevelPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.college is not None
    
    def has_object_permission(self, request, view, obj):
        return obj.college == request.user.college

class DepartmentLevelPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.department is not None
    
    def has_object_permission(self, request, view, obj):
        return obj.department == request.user.department

class ResourceApprovalPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in [RoleChoices.HOD, RoleChoices.ADMIN]
    
    def has_object_permission(self, request, view, obj):
        return (
            obj.course.department == request.user.department or
            request.user.role == RoleChoices.ADMIN
        )

class FinancialPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == RoleChoices.FINANCE

class LibraryStaffPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == RoleChoices.LIBRARY

class PrincipalLevelPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == RoleChoices.PRINCIPAL
    
class CanViewCourse(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in [
            RoleChoices.STUDENT, 
            RoleChoices.TEACHER, 
            RoleChoices.HOD
        ]