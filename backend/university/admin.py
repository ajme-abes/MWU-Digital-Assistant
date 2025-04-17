# # university/admin.py
# from django.contrib import admin
# from django.utils import timezone
# from django.utils.html import format_html
# from django.urls import reverse
# from .models import College, Department, Invitation

# class DepartmentInline(admin.TabularInline):
#     model = Department
#     extra = 1
#     show_change_link = True
#     fields = ('code', 'name', 'hod')
#     autocomplete_fields = ['hod']

# @admin.register(College)
# class CollegeAdmin(admin.ModelAdmin):
#     list_display = ('code', 'name', 'established_year', 'department_count')
#     search_fields = ('name', 'code')
#     list_filter = ('established_date',)
#     inlines = [DepartmentInline]

#     def established_year(self, obj):
#         return obj.established_date.year
#     established_year.short_description = 'Est. Year'

#     def department_count(self, obj):
#         return obj.departments.count()
#     department_count.short_description = 'Depts'

# @admin.register(Department)
# class DepartmentAdmin(admin.ModelAdmin):
#     list_display = ('name', 'code', 'college', 'hod_link', 'course_count')
#     list_filter = ('college',)
#     search_fields = ('name', 'code')
#     autocomplete_fields = ['hod']
#     readonly_fields = ()

#     def hod_link(self, obj):
#         if obj.hod:
#             url = reverse("admin:users_user_change", args=[obj.hod.id])
#             return format_html('<a href="{}">{}</a>', url, obj.hod.email)
#         return '-'
#     hod_link.short_description = 'HOD'

#     def course_count(self, obj):
#         return obj.courses.count()
#     course_count.short_description = 'Courses'

# @admin.register(Invitation)
# class InvitationAdmin(admin.ModelAdmin):
#     list_display = ('id', 'department', 'created_by', 'expires_at', 'is_valid')
#     list_filter = ('department__college', 'department')
#     search_fields = ('code',)
#     readonly_fields = ('created_at',)
#     autocomplete_fields = ['department', 'created_by']

#     def is_valid(self, obj):
#         now = timezone.now()
#         return obj.expires_at > now and not getattr(obj, 'used', False)
#     is_valid.boolean = True
#     is_valid.short_description = 'Valid'
from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from django.urls import reverse
from .models import College, Department

class DepartmentInline(admin.TabularInline):
    model = Department
    extra = 1
    show_change_link = True
    fields = ('code', 'name', 'hod')
    autocomplete_fields = ['hod']

@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'established_year', 'department_count')
    search_fields = ('name', 'code')
    list_filter = ('established_date',)
    inlines = [DepartmentInline]

    def established_year(self, obj):
        return obj.established_date.year
    established_year.short_description = 'Est. Year'

    def department_count(self, obj):
        return obj.departments.count()
    department_count.short_description = 'Depts'

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'college', 'hod_link', 'course_count')
    list_filter = ('college',)
    search_fields = ('name', 'code')
    autocomplete_fields = ['hod']

    def hod_link(self, obj):
        if obj.hod:
            url = reverse("admin:users_user_change", args=[obj.hod.id])
            return format_html('<a href="{}">{}</a>', url, obj.hod.email)
        return '-'
    hod_link.short_description = 'HOD'

    def course_count(self, obj):
        return obj.course_set.count()
    course_count.short_description = 'Courses'