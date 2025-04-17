# from django.db import models
# from django.conf import settings
# from django.utils import timezone
# from university.models import Department
# from django_ckeditor_5.fields import CKEditor5Field
# import uuid

# class Course(models.Model):
#     title = models.CharField(max_length=200)
#     description = models.TextField()
#     teacher = models.ForeignKey(
#         settings.AUTH_USER_MODEL, 
#         on_delete=models.CASCADE,
#         related_name='taught_courses'
#     )
#     department = models.ForeignKey(
#         Department,
#         on_delete=models.CASCADE,
#         related_name='courses'
#     )
#     visibility = models.CharField(
#         max_length=10,
#         choices=[('public', 'Public'), ('private', 'Private')],
#         default='public'
#     )
#     enrollment_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ['-created_at']
#         unique_together = ('department', 'title')

#     def __str__(self):
#         return f"{self.department.code} - {self.title}"

#     def save(self, *args, **kwargs):
#         """Auto-set department from teacher's department if not provided"""
#         if not self.department_id and self.teacher.department:
#             self.department = self.teacher.department
#         super().save(*args, **kwargs)

# class Resource(models.Model):
#     RESOURCE_TYPES = [
#         ('pdf', 'PDF'),
#         ('quiz', 'Quiz'),
#         ('video', 'Video'),
#         ('doc', 'Document'),
#     ]
    
#     course = models.ForeignKey(Course, on_delete=models.CASCADE)
#     title = models.CharField(max_length=200)
#     file = models.FileField(upload_to='department_resources/%Y/%m/%d/')
#     resource_type = models.CharField(max_length=10, choices=RESOURCE_TYPES)
#     description = models.TextField(blank=True)  # Add this line
#     uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
#     uploaded_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.title} ({self.resource_type})"

# # Keep Enrollment and Assignment models as they are

# class Enrollment(models.Model):
#     student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_enrollments')
#     course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_enrollments')
#     enrolled_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ('student', 'course')

# class Assignment(models.Model):
#     course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_assignments')
#     title = models.CharField(max_length=200)
#     description = CKEditor5Field('Description', config_name='extends')
#     deadline = models.DateTimeField(
#         null=False,  # Make deadline required
#         help_text="Deadline must be set for all assignments"
#     )    
#     questions = models.JSONField(default=list)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.title
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from django_ckeditor_5.fields import CKEditor5Field

class Course(models.Model):
    department = models.ForeignKey('university.Department', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    code = models.CharField(max_length=20)
    description = models.TextField()
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='taught_courses'
    )
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]
    visibility = models.CharField(
        max_length=10,
        choices=VISIBILITY_CHOICES,
        default='public'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('department', 'code')

    def clean(self):
        # Validate teacher belongs to department
        if self.teacher.department != self.department:
            raise ValidationError("Teacher must belong to the course department")

class Enrollment(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')
class Resource(models.Model):
    RESOURCE_TYPES = [
        ('pdf', 'PDF'),
        ('quiz', 'Quiz'),
        ('video', 'Video'),
        ('doc', 'Document'),
    ]
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='resources/%Y/%m/%d/')
    resource_type = models.CharField(max_length=10, choices=RESOURCE_TYPES)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, 
                                  on_delete=models.SET_NULL,
                                  null=True)
    status = models.CharField(
        max_length=8,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL,
                                  null=True,
                                  blank=True,
                                  on_delete=models.SET_NULL,
                                  related_name='approved_resources')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def approve(self, user):
        if user != self.course.department.hod:
            raise PermissionDenied("Only HOD can approve resources")
        self.status = 'approved'
        self.approved_by = user
        self.save()

    def reject(self, user):
        if user != self.course.department.hod:
            raise PermissionDenied("Only HOD can reject resources")
        self.status = 'rejected'
        self.approved_by = user
        self.save()



class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_assignments')
    title = models.CharField(max_length=200)
    description = CKEditor5Field('Description', config_name='extends')
    deadline = models.DateTimeField(
        null=False,  # Make deadline required
        help_text="Deadline must be set for all assignments"
    )    
    questions = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title