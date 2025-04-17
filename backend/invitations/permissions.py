# invitations/permissions.py
from rest_framework import permissions
from core.permissions import IsHOD, SameDepartment

class InvitationPermission(IsHOD, SameDepartment):
    def has_permission(self, request, view):
        if view.action == 'create':
            department_id = request.data.get('department')
            return (
                super().has_permission(request, view) and
                str(request.user.department.id) == department_id
            )
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return (
            obj.department == request.user.department and
            obj.created_by == request.user
        )