
from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from django.urls import reverse
from .models import College, Department
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

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
    def save_model(self, request, obj, form, change):
        if not obj.pk:  # Only set created_by on first save
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.none()
        return qs

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'college', 'hod_link', 'course_count')
    list_filter = ('college',)
    search_fields = ('name', 'code','college__name', 'hod__email')
    autocomplete_fields = ['hod']

    def hod_email(self, obj):
        return obj.hod.email if obj.hod else '-'
    hod_email.short_description = 'HOD Email'

    def hod_link(self, obj):
        if obj.hod:
            url = reverse("admin:users_user_change", args=[obj.hod.id])
            return format_html('<a href="{}">{}</a>', url, obj.hod.email)
        return '-'
    hod_link.short_description = 'HOD'

    def course_count(self, obj):
        return obj.course_set.count()
    course_count.short_description = 'Courses'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.none()
        return qs
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "hod":
            User = get_user_model()  # Call here inside the method

            kwargs["queryset"] = User.objects.filter(role='HOD')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

# admin.site.register(College, CollegeAdmin)
# admin.site.register(Department, DepartmentAdmin)