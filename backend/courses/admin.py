# # courses/admin.py
# from django.contrib import admin
# from django.utils.html import format_html
# from django.urls import reverse
# from django.utils import timezone
# from .models import Course, Resource, Enrollment, Assignment

# class ResourceInline(admin.TabularInline):
#     model = Resource
#     extra = 1
#     fields = ('title', 'file_link', 'resource_type', 'description')
#     readonly_fields = ('file_link', 'uploaded_at')

#     def file_link(self, obj):
#         if obj.file:
#             return format_html('<a href="{}">Download</a>', obj.file.url)
#         return '-'
#     file_link.short_description = 'File'

# class AssignmentInline(admin.TabularInline):
#     model = Assignment
#     extra = 1
#     fields = ('title', 'deadline', 'status')
#     readonly_fields = ('status',)

#     def status(self, obj):
#         now = timezone.now()
#         if obj.deadline is None:
#             return "No deadline"
#         return "Active" if obj.deadline > now else "Expired"

# @admin.register(Course)
# class CourseAdmin(admin.ModelAdmin):
#     list_display = ('code', 'title', 'department', 'teacher_link', 'visibility', 'enrollment_count')
#     list_filter = ('visibility', 'department__college', 'department')
#     search_fields = ('title', 'department__name')
#     inlines = [ResourceInline, AssignmentInline]
#     readonly_fields = ('created_at', 'updated_at')
#     actions = ['clone_course']

#     def code(self, obj):
#         return obj.department.code + '-' + str(obj.id)
#     code.short_description = 'Course Code'

#     def teacher_link(self, obj):
#         url = reverse("admin:users_user_change", args=[obj.teacher.id])
#         return format_html('<a href="{}">{}</a>', url, obj.teacher.email)
#     teacher_link.short_description = 'Teacher'

#     def enrollment_count(self, obj):
#         return obj.course_enrollments.count()
#     enrollment_count.short_description = 'Enrollments'

#     @admin.action(description='Clone selected courses')
#     def clone_course(self, request, queryset):
#         for course in queryset:
#             course.pk = None
#             course.title += " (Copy)"
#             course.save()

# @admin.register(Resource)
# class ResourceAdmin(admin.ModelAdmin):
#     list_display = ('title', 'course_link', 'resource_type', 'uploaded_at')
#     list_filter = ('resource_type', 'course__department')
#     search_fields = ('title', 'course__title')
#     readonly_fields = ('uploaded_at', 'file_preview')

#     def course_link(self, obj):
#         url = reverse("admin:courses_course_change", args=[obj.course.id])
#         return format_html('<a href="{}">{}</a>', url, obj.course.title)
#     course_link.short_description = 'Course'

#     def file_preview(self, obj):
#         if obj.file:
#             return format_html('<a href="{}" target="_blank">Preview</a>', obj.file.url)
#         return '-'
#     file_preview.short_description = 'Preview'

# @admin.register(Enrollment)
# class EnrollmentAdmin(admin.ModelAdmin):
#     list_display = ('student_email', 'course_link', 'enrolled_at')
#     list_filter = ('course__department', 'enrolled_at')
#     search_fields = ('student__email', 'course__title')

#     def student_email(self, obj):
#         return obj.student.email
#     student_email.short_description = 'Student'

#     def course_link(self, obj):
#         url = reverse("admin:courses_course_change", args=[obj.course.id])
#         return format_html('<a href="{}">{}</a>', url, obj.course.title)
#     course_link.short_description = 'Course'

# @admin.register(Assignment)
# class AssignmentAdmin(admin.ModelAdmin):
#     list_display = ('title', 'course_link', 'deadline_status', 'question_count')
    
#     def deadline_status(self, obj):
#         if obj.deadline is None:
#             return "Not Set"
#         now = timezone.now()
#         return "Active" if obj.deadline > now else "Expired"
#     deadline_status.short_description = "Status"

#     def course_link(self, obj):
#         url = reverse("admin:courses_course_change", args=[obj.course.id])
#         return format_html('<a href="{}">{}</a>', url, obj.course.title)
#     course_link.short_description = "Course"

#     def question_count(self, obj):
#         return len(obj.questions)
#     question_count.short_description = "Questions"

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils import timezone
from .models import Course, Resource, Enrollment, Assignment

class ResourceInline(admin.TabularInline):
    model = Resource
    extra = 1
    fields = ('title', 'file_link', 'resource_type', 'status')
    readonly_fields = ('file_link', 'uploaded_at')

    def file_link(self, obj):
        if obj.file:
            return format_html('<a href="{}">Download</a>', obj.file.url)
        return '-'
    file_link.short_description = 'File'

class AssignmentInline(admin.TabularInline):
    model = Assignment
    extra = 1
    fields = ('title', 'deadline', 'status')
    readonly_fields = ('status',)

    def status(self, obj):
        now = timezone.now()
        if obj.deadline is None:
            return "No deadline"
        return "Active" if obj.deadline > now else "Expired"
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'title', 'department', 'teacher_link', 'get_visibility_display', 'enrollment_count')
    list_filter = ('department__college', 'department', 'visibility')
    search_fields = ('title', 'department__name')
    readonly_fields = ('created_at', 'updated_at')

    def code(self, obj):
        return f"{obj.department.code}-{obj.id}"
    code.short_description = 'Course Code'

    def get_visibility_display(self, obj):
        return obj.get_visibility_display()
    get_visibility_display.short_description = 'Visibility'

    def teacher_link(self, obj):
        url = reverse("admin:users_user_change", args=[obj.teacher.id])
        return format_html('<a href="{}">{}</a>', url, obj.teacher.email)
    teacher_link.short_description = 'Teacher'

    def enrollment_count(self, obj):
        return obj.enrollment_set.count()
    enrollment_count.short_description = 'Enrollments'
# @admin.register(Course)
# class CourseAdmin(admin.ModelAdmin):
#     list_display = ('code', 'title', 'department', 'teacher_link', 'visibility', 'enrollment_count')
#     list_filter = ('visibility', 'department__college', 'department')
#     search_fields = ('title', 'department__name')
#     inlines = [ResourceInline, AssignmentInline]
#     readonly_fields = ('created_at', 'updated_at')
#     actions = ['clone_course']

#     def code(self, obj):
#         return obj.department.code + '-' + str(obj.id)
#     code.short_description = 'Course Code'

#     def teacher_link(self, obj):
#         url = reverse("admin:users_user_change", args=[obj.teacher.id])
#         return format_html('<a href="{}">{}</a>', url, obj.teacher.email)
#     teacher_link.short_description = 'Teacher'

#     def enrollment_count(self, obj):
#         return obj.course_enrollments.count()
#     enrollment_count.short_description = 'Enrollments'

#     @admin.action(description='Clone selected courses')
#     def clone_course(self, request, queryset):
#         for course in queryset:
#             course.pk = None
#             course.title += " (Copy)"
#             course.save()

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'course_link', 'resource_type', 'status', 'uploaded_at')
    list_filter = ('resource_type', 'course__department', 'status')
    search_fields = ('title', 'course__title')
    readonly_fields = ('uploaded_at', 'file_preview')

    def course_link(self, obj):
        url = reverse("admin:courses_course_change", args=[obj.course.id])
        return format_html('<a href="{}">{}</a>', url, obj.course.title)
    course_link.short_description = 'Course'

    def file_preview(self, obj):
        if obj.file:
            return format_html('<a href="{}" target="_blank">Preview</a>', obj.file.url)
        return '-'
    file_preview.short_description = 'Preview'

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student_email', 'course_link', 'enrolled_at')
    list_filter = ('course__department', 'enrolled_at')
    search_fields = ('student__email', 'course__title')

    def student_email(self, obj):
        return obj.student.email
    student_email.short_description = 'Student'

    def course_link(self, obj):
        url = reverse("admin:courses_course_change", args=[obj.course.id])
        return format_html('<a href="{}">{}</a>', url, obj.course.title)
    course_link.short_description = 'Course'

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'course_link', 'deadline_status', 'question_count')
    
    def deadline_status(self, obj):
        if obj.deadline is None:
            return "Not Set"
        now = timezone.now()
        return "Active" if obj.deadline > now else "Expired"
    deadline_status.short_description = "Status"

    def course_link(self, obj):
        url = reverse("admin:courses_course_change", args=[obj.course.id])
        return format_html('<a href="{}">{}</a>', url, obj.course.title)
    course_link.short_description = "Course"

    def question_count(self, obj):
        return len(obj.questions)
    question_count.short_description = "Questions"