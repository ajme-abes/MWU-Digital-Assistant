from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLES = [('student', 'Student'), ('teacher', 'Teacher'), ('admin', 'Admin')]
    role = models.CharField(max_length=10, choices=ROLES, default='student')