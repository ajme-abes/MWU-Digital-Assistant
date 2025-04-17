# from rest_framework import permissions

# class IsCollegeAdmin(permissions.BasePermission):
#     def has_permission(self, request, view):
#         return request.user.roles.filter(
#             name='ADMIN', 
#             college=request.user.college
#         ).exists()

# class IsDepartmentHOD(permissions.BasePermission):
#     def has_permission(self, request, view):
#         return request.user.roles.filter(
#             name='HOD',
#             department=request.user.department
#         ).exists() and request.user.department.hod == request.user

# class ManagesDepartment(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         return obj.department == request.user.department
# users/permissions.py
from rest_framework import permissions
from core.permissions import IsAdmin, IsHOD, SameCollege

class ManagesCollege(IsAdmin, SameCollege):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.college

class ManagesDepartment(IsHOD):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.department

class IsDepartmentHOD(ManagesDepartment):
    def has_object_permission(self, request, view, obj):
        return obj.department == request.user.department