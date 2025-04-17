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

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == RoleChoices.ADMIN

class IsHOD(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == RoleChoices.HOD

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == RoleChoices.TEACHER

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == RoleChoices.STUDENT

class SameCollege(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.college == request.user.college

class SameDepartment(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.department == request.user.department