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
from core.permissions import RoleChoices
from django.db.models.signals import pre_save
from django.dispatch import receiver

class College(models.Model):
    name = models.CharField(max_length=150, unique=True)
    code = models.CharField(max_length=10, unique=True)
    established_date = models.DateField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,
                                 on_delete=models.SET_NULL,
                                 null=True,
                                 related_name='created_colleges',
                                 editable=False
                                 )
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['name'],
                name='unique_college_name',
                violation_error_message="College name must be unique"
            ),
            models.UniqueConstraint(
                fields=['code'],
                name='unique_college_code',
                violation_error_message="College code must be unique"
            )
        ]

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
        constraints = [
            models.UniqueConstraint(
                fields=['name'],
                name='unique_department_name',
                violation_error_message="Department name must be unique "
            ),
            models.UniqueConstraint(
                fields=['code'],
                name='unique_department_code',
                violation_error_message="Department code must be unique "
            )
        ]
    

    def clean(self):
        """Validate HOD assignment"""
        if self.hod:
            if self.hod.role != 'HOD':
                raise ValidationError("Assigned user must be an HOD")
            if self.hod.department != self:
                raise ValidationError("HOD must belong to this department")

    def save(self, *args, **kwargs):
        # Clear previous HOD's role if changed
        if self.id:
            old_department = Department.objects.get(id=self.id)
            if old_department.hod and old_department.hod != self.hod:
                old_department.hod.role = RoleChoices.TEACHER
                old_department.hod.save()

        # Set new HOD's role and department
        if self.hod:
            self.hod.role = RoleChoices.HOD
            self.hod.department = self
            self.hod.save()

        super().save(*args, **kwargs)

@receiver(pre_save, sender=Department)
def validate_college_consistency(sender, instance, **kwargs):
    if instance.hod and instance.hod.department.college != instance.college:
        raise ValidationError("HOD must belong to the same college as department")

    def __str__(self):
        return f"{self.college.code} - {self.name} ({self.code})"