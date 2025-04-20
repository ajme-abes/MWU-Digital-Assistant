
from rest_framework import permissions
from core.permissions import (
    IsAdmin,
    IsHOD,
    CollegeLevelPermission as SameCollege,
    DepartmentLevelPermission as ManagesDepartment
)

class ManagesCollege(IsAdmin, SameCollege):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.college

class ManagesDepartment(IsHOD):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.department

class IsDepartmentHOD(ManagesDepartment):
    def has_object_permission(self, request, view, obj):
        return obj.department == request.user.department