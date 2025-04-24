from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from django_ckeditor_5.fields import CKEditor5Field
from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator, MinValueValidator, MaxValueValidator
from django.core.files.storage import FileSystemStorage
from django.contrib.postgres.fields import ArrayField
class Course(models.Model):
    department = models.ForeignKey('university.Department', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    code = models.CharField(max_length=20)
    description = models.TextField()
    is_active = models.BooleanField(default=True)

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



# Custom storage with size limits
class SecureFileStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        # Prevent overwrite
        if self.exists(name):
            raise ValidationError("File with this name already exists")
        return super().get_available_name(name, max_length)

MAX_FILE_SIZE = 1024 * 1024 * 100  # 100MB

def validate_file_size(value):
    if value.size > MAX_FILE_SIZE:
        raise ValidationError(f'File size exceeds {MAX_FILE_SIZE//1024//1024}MB limit')

# ==================== Resource Model ====================
class Resource(models.Model):
    RESOURCE_TYPES = [
        ('pdf', 'PDF'),
        ('quiz', 'Quiz'),
        ('video', 'Video'),
        ('doc', 'Document'),
    ]
    
    course = models.ForeignKey('Course', on_delete=models.CASCADE,related_name="resources")
    title = models.CharField(max_length=200)
    file = models.FileField(
        upload_to='resources/%Y/%m/%d/',
        storage=SecureFileStorage(),
        validators=[
            FileExtensionValidator(['pdf', 'doc', 'docx', 'odt', 'mp4', 'mov', 'avi', 'json']),
            validate_file_size
        ]
    )
    resource_type = models.CharField(max_length=10, choices=RESOURCE_TYPES)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_resources'
    )
    status = models.CharField(
        max_length=8,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='approved_resources'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    download_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    file_size = models.PositiveIntegerField( validators=[MaxValueValidator(1048576)],default="0", null=False, blank=False,editable=False)
    version = models.PositiveSmallIntegerField(default=1)
    previous_versions = ArrayField(models.UUIDField(), default=list, blank=True)
    description = models.TextField(null=True, blank=True)
    rejection_reason = models.TextField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
        super().save(*args, **kwargs)

    def soft_delete(self):
        self.is_active = False
        self.save()

# ==================== Enrollment Model ====================
class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn')
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="enrollment_set")
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    notification_prefs = models.JSONField(
        default=dict,
        help_text="Notification preferences for enrollment updates"
    )

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.status = 'withdrawn'
        self.save()

# ==================== ResourceDownload Model ====================
class ResourceDownload(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    downloaded_at = models.DateTimeField(auto_now_add=True)
    device_info = models.JSONField(default=dict)

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