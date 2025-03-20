from django.db import models

from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'), 
        ('admin', 'Admin')
        ]
    role = models.CharField(max_length=10, choices=ROLES, default='student')
    enrollment_code = models.CharField(max_length=20, blank=True, null=True)  # For private courses

    def __str__(self):
        return self.username  # Display username in admin