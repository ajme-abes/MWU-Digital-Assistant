# # users/admin.py
# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from django.utils.html import format_html
# from django.urls import reverse
# from .models import User, Role

# class RoleInline(admin.TabularInline):
#     model = User.roles.through
#     extra = 1
#     verbose_name = "Role Assignment"
#     verbose_name_plural = "Role Assignments"
#     autocomplete_fields = ['role']

# class CustomUserAdmin(UserAdmin):
#     list_display = ('email', 'college_display', 'department_display', 'role_list', 'is_active')
#     list_filter = ('college', 'department', 'is_active', 'is_staff')
#     raw_id_fields = ('department', 'college')
#     filter_horizontal = ('roles',)
#     ordering = ('-date_joined',)
#     search_fields = ('email', 'college__name', 'department__name')
#     ordering = ('-date_joined',)
#     readonly_fields = ('last_login', 'date_joined')
#     inlines = [RoleInline]
#     actions = ['activate_users', 'deactivate_users']

#     fieldsets = (
#         (None, {'fields': ('email', 'password')}),
#         ('Institutional Info', {'fields': ('college', 'department')}),
#         ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
#         ('Timestamps', {'fields': ('last_login', 'date_joined')}),
#     )

#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'password1', 'password2', 'college', 'department'),
#         }),
#     )

#     def college_display(self, obj):
#         return obj.college.code if obj.college else '-'
#     college_display.short_description = 'College'

#     def department_display(self, obj):
#         return f"{obj.department.code}" if obj.department else '-'
#     department_display.short_description = 'Department'

#     def role_list(self, obj):
#         return ", ".join([r.get_name_display() for r in obj.roles.all()])
#     role_list.short_description = 'Roles'

#     def get_queryset(self, request):
#         qs = super().get_queryset(request).select_related('college', 'department')
#         if not request.user.is_superuser:
#             return qs.filter(college=request.user.college)
#         return qs

#     @admin.action(description='Activate selected users')
#     def activate_users(self, request, queryset):
#         queryset.update(is_active=True)

#     @admin.action(description='Deactivate selected users')
#     def deactivate_users(self, request, queryset):
#         queryset.update(is_active=False)

# class RoleAdmin(admin.ModelAdmin):
#     list_display = ('name', 'college_display', 'department_display')
#     list_filter = ('name', 'college')
#     search_fields = ('college__name', 'department__name')
#     autocomplete_fields = ['college', 'department']

#     def college_display(self, obj):
#         return obj.college.name if obj.college else 'System'
#     college_display.short_description = 'College'

#     def department_display(self, obj):
#         return obj.department.name if obj.department else 'All Departments'
#     department_display.short_description = 'Department'

# admin.site.register(User, CustomUserAdmin)
# admin.site.register(Role, RoleAdmin)

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.urls import reverse
from .models import User
from core.permissions import RoleChoices

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'role', 'college_display', 'department_display', 'is_active')
    list_filter = ('role', 'college', 'department', 'is_active', 'is_staff')
    raw_id_fields = ('department', 'college')
    ordering = ('-date_joined',)
    search_fields = ('email', 'college__name', 'department__name')
    readonly_fields = ('last_login', 'date_joined')
    actions = ['activate_users', 'deactivate_users']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Role Information', {'fields': ('role',)}),
        ('Institutional Info', {'fields': ('college', 'department')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Timestamps', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role', 'college', 'department'),
        }),
    )

    def college_display(self, obj):
        return obj.college.code if obj.college else '-'
    college_display.short_description = 'College'

    def department_display(self, obj):
        return f"{obj.department.code}" if obj.department else '-'
    department_display.short_description = 'Department'

    def get_queryset(self, request):
        qs = super().get_queryset(request).select_related('college', 'department')
        if not request.user.is_superuser:
            return qs.filter(college=request.user.college)
        return qs

    @admin.action(description='Activate selected users')
    def activate_users(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description='Deactivate selected users')
    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)

admin.site.register(User, CustomUserAdmin)