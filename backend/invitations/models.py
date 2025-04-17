from django.db import models
from django.conf import settings
import uuid
from django.core.exceptions import ValidationError
from django.utils import timezone

class Invitation(models.Model):
    TYPES = [
        ('STUDENT', 'Student'),
        ('TEACHER', 'Teacher'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=48, unique=True)
    invitation_type = models.CharField(max_length=7, choices=TYPES)
    department = models.ForeignKey('university.Department', on_delete=models.CASCADE)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,
                                 on_delete=models.CASCADE,
                                 related_name='created_invitations')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    max_uses = models.PositiveIntegerField(default=1)
    used_count = models.PositiveIntegerField(default=0)

    class Meta:
        indexes = [
            models.Index(fields=['expires_at', 'used_count']),
        ]

    def is_valid(self):
        return self.used_count < self.max_uses and self.expires_at > timezone.now()

    def clean(self):
        # Ensure creator is HOD of the department
        if self.created_by != self.department.hod:
            raise ValidationError("Only department HOD can create invitations")