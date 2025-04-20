
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils import timezone
from .models import Course, Resource, Enrollment, Assignment, ResourceDownload

class IsActiveFilter(admin.SimpleListFilter):
    title = 'Active status'
    parameter_name = 'is_active'

    def lookups(self, request, model_admin):
        return (
            ('active', 'Active'),
            ('inactive', 'Inactive'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'active':
            return queryset.filter(is_active=True)
        if self.value() == 'inactive':
            return queryset.filter(is_active=False)

class ResourceInline(admin.TabularInline):
    model = Resource
    extra = 1
    fields = ('title', 'file_link', 'resource_type', 'status')
    readonly_fields = ('file_link',)
    show_change_link = True

    def file_link(self, obj):
        if obj.file:
            return format_html(
                '<a href="{}" target="_blank">Download</a> ({} MB)',
                obj.file.url,
                round(obj.file_size/1024/1024, 2)
            )
        return '-'
    file_link.short_description = 'File'

class AssignmentInline(admin.TabularInline):
    model = Assignment
    extra = 1
    fields = ('title', 'deadline', 'status', 'question_count')
    readonly_fields = ('status', 'question_count')
    def question_count(self, obj):
        return len(obj.questions)
    question_count.short_description = 'Questions'

    def status(self, obj):
        if obj.deadline is None:
            return "No deadline"
        return "Active" if obj.deadline > timezone.now() else "Expired"

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    def enrollment_count(self, obj):
        return obj.enrollment_set.count()
    enrollment_count.short_description = 'Enrollments'
    list_display = ('code', 'title', 'department', 'teacher_link', 
                   'get_visibility_display', 'enrollment_count', 'is_active')  
    list_filter = (IsActiveFilter, 'department__college', 'department', 'visibility')
    search_fields = ('title', 'department__name', 'teacher__email')
    readonly_fields = ('created_at', 'updated_at', 'storage_usage', 'enrollment_stats')
    actions = ['recover_selected']
    inlines = [ResourceInline, AssignmentInline]

    fieldsets = (
        (None, {
            'fields': ('title', 'code', 'description', 'teacher', 
                      'department', 'visibility', 'is_active')
        }),
        ('Statistics', {
            'fields': ('enrollment_stats', 'storage_usage'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def code(self, obj):
        return f"{obj.department.code}-{obj.id}"
    code.short_description = 'Course Code'

    def teacher_link(self, obj):
        url = reverse("admin:users_user_change", args=[obj.teacher.id])
        return format_html('<a href="{}">{}</a>', url, obj.teacher.email)
    teacher_link.short_description = 'Teacher'

    def storage_usage(self, obj):
        total = sum(r.file_size for r in obj.resources.all()) / 1024 / 1024
        return f"{round(total, 2)} MB"
    storage_usage.short_description = 'Storage Used'

    def enrollment_stats(self, obj):
        active = obj.enrollments.filter(is_active=True).count()
        total = obj.enrollments.count()
        return f"{active} active / {total} total"
    enrollment_stats.short_description = 'Enrollments'

    def recover_selected(self, request, queryset):
        queryset.update(is_active=True)
    recover_selected.short_description = "Recover selected courses"

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'course_link', 'resource_type', 'status', 'version', 'download_count', 'is_active')
    list_filter = (IsActiveFilter, 'resource_type', 'course__department', 'status')
    search_fields = ('title', 'course__title', 'uploaded_by__email')
    readonly_fields = ('uploaded_at', 'approved_at', 'file_preview', 'version_history', 'download_count')
    actions = ['approve_selected', 'recover_selected']

    # CORRECTED FIELDSETS WITHOUT DUPLICATES
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'file', 'resource_type', 'course', 'uploaded_by', 'status')
        }),
        ('Approval Details', {
            'fields': ('approved_by', 'rejection_reason', 'approved_at'),
            'classes': ('collapse',)
        }),
        ('Version History', {
            'fields': ('version', 'version_history'),
            'classes': ('collapse',)
        }),
        ('File Details', {
            'fields': ('file_preview', 'uploaded_at', 'download_count'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_active',),
            'classes': ('collapse',)
        }),
    )

    def course_link(self, obj):
        url = reverse("admin:courses_course_change", args=[obj.course.id])
        return format_html('<a href="{}">{}</a>', url, obj.course.title)
    course_link.short_description = 'Course'

    def file_preview(self, obj):
        if obj.file:
            return format_html(
                '<a href="{}" target="_blank">Preview</a> ({} MB)',
                obj.file.url,
                round(obj.file_size/1024/1024, 2)
            )
        return '-'
    file_preview.short_description = 'Preview'

    def version_history(self, obj):
        versions = Resource.objects.filter(id__in=obj.previous_versions)
        links = []
        for v in versions:
            url = reverse("admin:courses_resource_change", args=[v.id])
            links.append(f'<li><a href="{url}">Version {v.version}</a></li>')
        return format_html('<ul>{}</ul>', ''.join(links)) if links else '-'
    version_history.short_description = 'Previous Versions'

    def approve_selected(self, request, queryset):
        queryset.update(status='approved', approved_by=request.user, approved_at=timezone.now())
    approve_selected.short_description = "Approve selected resources"

    def recover_selected(self, request, queryset):
        queryset.update(is_active=True)
    recover_selected.short_description = "Recover selected resources"

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student_email', 'course_link', 'status', 'is_active', 'enrolled_at')
    list_filter = (IsActiveFilter, 'course__department', 'status')
    search_fields = ('student__email', 'course__title')
    actions = ['recover_selected']

    def student_email(self, obj):
        return obj.student.email
    student_email.short_description = 'Student'

    def course_link(self, obj):
        url = reverse("admin:courses_course_change", args=[obj.course.id])
        return format_html('<a href="{}">{}</a>', url, obj.course.title)
    course_link.short_description = 'Course'

    def recover_selected(self, request, queryset):
        queryset.update(is_active=True, status='approved')
    recover_selected.short_description = "Recover selected enrollments"

@admin.register(ResourceDownload)
class ResourceDownloadAdmin(admin.ModelAdmin):
    list_display = ('resource', 'user_email', 'downloaded_at', 'device_info')
    list_filter = ('resource__course__department', 'downloaded_at')
    search_fields = ('resource__title', 'user__email')
    readonly_fields = ('device_details',)

    def user_email(self, obj):
        return obj.user.email if obj.user else 'Anonymous'
    user_email.short_description = 'User'

    def device_details(self, obj):
        info = obj.device_info
        return format_html(
            "IP: {}<br>Browser: {}<br>Platform: {}",
            info.get('ip_address'),
            info.get('user_agent'),
            info.get('platform')
        )
    device_details.short_description = 'Device Information'

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'course_link', 'deadline_status', 'question_count', 'submission_count')
    
    def deadline_status(self, obj):
        now = timezone.now()
        return format_html(
            '<span style="color: {};">{}</span>',
            '#4CAF50' if obj.deadline > now else '#F44336',
            "Active" if obj.deadline > now else "Expired"
        )
    deadline_status.short_description = "Status"
    deadline_status.allow_tags = True

    def course_link(self, obj):
        url = reverse("admin:courses_course_change", args=[obj.course.id])
        return format_html('<a href="{}">{}</a>', url, obj.course.title)
    course_link.short_description = "Course"

    def question_count(self, obj):
        return len(obj.questions)
    question_count.short_description = "Questions"

    def submission_count(self, obj):
        return obj.submissions.count()
    submission_count.short_description = "Submissions"