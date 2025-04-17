# from django.db import models
# from django.conf import settings
# from django.utils import timezone
# from datetime import timedelta
# import uuid

# class College(models.Model):
#     name = models.CharField(max_length=150, unique=True)
#     code = models.CharField(max_length=10, unique=True)
#     established_date = models.DateField()

#     def __str__(self):
#         return f"{self.name} ({self.code})"

# class Department(models.Model):
#     college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='departments')
#     name = models.CharField(max_length=150)
#     code = models.CharField(max_length=10)
#     hod = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         null=True,  # Allow NULL in DB
#         blank=True,  # Allow empty in forms
#         on_delete=models.SET_NULL,
#         related_name='headed_departments'
#     )
    
#     # Add these fields
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         unique_together = [('college', 'code'), ('college', 'name')]

#     def __str__(self):
#         return f"{self.college.code} - {self.name} ({self.code})"

# class Invitation(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     code = models.CharField(max_length=48, unique=True) 
#     department = models.ForeignKey(Department, on_delete=models.CASCADE)
#     created_by = models.ForeignKey(settings.AUTH_USER_MODEL,
#                                  on_delete=models.CASCADE,
#                                  related_name='invitations')
#     created_at = models.DateTimeField(auto_now_add=True)
#     expires_at = models.DateTimeField()
#     max_uses = models.PositiveIntegerField(default=1)
#     used_count = models.PositiveIntegerField(default=0)

#     @property
#     def is_valid(self):
#         return self.used_count < self.max_uses and self.expires_at > timezone.now()

#     class Meta:
#         indexes = [
#             models.Index(fields=['expires_at', 'used_count']),
#         ]
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

class College(models.Model):
    name = models.CharField(max_length=150, unique=True)
    code = models.CharField(max_length=10, unique=True)
    established_date = models.DateField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,
                                 on_delete=models.SET_NULL,
                                 null=True,
                                 related_name='created_colleges')

    def __str__(self):
        return f"{self.name} ({self.code})"

class Department(models.Model):
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=10)
    hod = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='headed_departments'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('college', 'code'), ('college', 'name')]

    def __str__(self):
        return f"{self.college.code} - {self.name}"

    def clean(self):
        # Validate HOD assignment
        if self.hod:
            if self.hod.role != RoleChoices.HOD:
                raise ValidationError("Assigned user must be an HOD")
            if self.hod.college != self.college:
                raise ValidationError("HOD must belong to the same college")