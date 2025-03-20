# courses/admin.py
from django.contrib import admin
from .models import Course, Resource, Enrollment, Assignment
from django.utils.html import format_html
from django.urls import reverse
from import_export.admin import ImportExportActionModelAdmin
from django.utils.timezone import now

# Inline for Resources (edit resources directly on Course page)
class ResourceInline(admin.TabularInline):
    model = Resource
    extra = 1
    fields = ('file', 'resource_type', 'uploaded_at')
    readonly_fields = ('uploaded_at',)

# Inline for Enrollments (view enrollments on Course page)
class EnrollmentInline(admin.TabularInline):
    model = Enrollment
    extra = 0
    readonly_fields = ('enrolled_at',)
    raw_id_fields = ('student',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'teacher_link', 'visibility', 'enrollment_code', 'created_at_display')
    list_filter = ('visibility', 'created_at')  # Fixed filter
    date_hierarchy = 'created_at'  # Now valid
    search_fields = ('title', 'teacher__username')
    inlines = [ResourceInline, EnrollmentInline]

    def created_at_display(self, obj):
        return obj.created_at.strftime("%Y-%m-%d %H:%M")
    created_at_display.short_description = 'Created At'


    def teacher_link(self, obj):
        url = reverse("admin:users_user_change", args=[obj.teacher.id])
        return format_html('<a href="{}">{}</a>', url, obj.teacher.username)
    teacher_link.short_description = "Teacher"

    def export_as_csv(self, request, queryset):
        # Implement CSV export logic here
        pass

# Custom Resource Admin with File Preview
@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('course_title', 'resource_type', 'file_link', 'uploaded_at')
    list_filter = ('resource_type', 'uploaded_at')
    search_fields = ('course__title',)
    
    def course_title(self, obj):
        return obj.course.title
    course_title.short_description = "Course"

    def file_link(self, obj):
        if obj.file:
            return format_html('<a href="{}">Download</a>', obj.file.url)
        return "-"
    file_link.short_description = "File"

# Enrollment Admin with Time Filters
@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'enrolled_at')
    list_filter = ('enrolled_at',)
    search_fields = ('student__username', 'course__title')
    raw_id_fields = ('student', 'course')

# Assignment Admin with Deadline Alerts
@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('course', 'title', 'deadline', 'days_remaining', 'question_count')
    list_filter = ('deadline',)
    search_fields = ('course__title', 'title')
    def days_remaining(self, obj):
        delta = obj.deadline - now().date()
        return delta.days if delta.days > 0 else "Expired"
    days_remaining.short_description = "Days Left"
    days_remaining.short_description = "Days Left"

    def question_count(self, obj):
        return len(obj.questions) if obj.questions else 0
    question_count.short_description = "Questions"