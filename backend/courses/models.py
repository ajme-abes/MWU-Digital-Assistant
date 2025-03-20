from django.db import models
from users.models import User
from ckeditor.fields import RichTextField
import uuid

class Course(models.Model):
    name = models.CharField(max_length=255)  # Ensure this is present
    title = models.CharField(max_length=200)
    description = models.TextField()
    teacher = models.ForeignKey('users.User', on_delete=models.CASCADE)
    visibility = models.CharField(max_length=10, choices=[('public', 'Public'), ('private', 'Private')])
    enrollment_code = models.CharField(max_length=32, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Add this field

    def __str__(self):
        return self.title
class Resource(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='resources')
    file = models.FileField(upload_to='resources/')
    resource_type = models.CharField(max_length=10, choices=[('pdf', 'PDF'), ('quiz', 'Quiz')])
    uploaded_at = models.DateTimeField(auto_now_add=True)  # Ensure this line exists!

class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=200)
    description = models.TextField()
    deadline = models.DateTimeField()
    # Store questions as JSON (e.g., {"questions": [{"type": "mcq", "text": "...", "options": [...]}]})
    questions = models.JSONField()