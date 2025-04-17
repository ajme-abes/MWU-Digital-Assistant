# # university/permissions.py
# from rest_framework import permissions

# class CollegeAdminPermission(permissions.BasePermission):
#     def has_permission(self, request, view):
#         return request.user.roles.filter(
#             name='ADMIN',
#             college__code=view.kwargs.get('college_code')
#         ).exists()

# class DepartmentLevelPermission(permissions.BasePermission):
#     def has_permission(self, request, view):
#         return request.user.roles.filter(
#             name__in=['HOD', 'FACULTY'],
#             department__code=view.kwargs.get('dept_code'),
#             department__college__code=view.kwargs.get('college_code')
#         ).exists()

# university/permissions.py
from rest_framework import permissions
from core.permissions import IsAdmin, SameCollege

class CollegeLevelPermission(IsAdmin, SameCollege):
    def has_permission(self, request, view):
        college_code = view.kwargs.get('college_code')
        if college_code:
            return request.user.college.code == college_code
        return super().has_permission(request, view)

class DepartmentLevelPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        dept_code = view.kwargs.get('dept_code')
        college_code = view.kwargs.get('college_code')
        return (
            request.user.department and
            request.user.department.code == dept_code and
            request.user.department.college.code == college_code
        )