from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
import uuid

class Invitation(models.Model):
    TYPES = [
        ('STUDENT', 'Student'),
        ('TEACHER', 'Teacher'),
    ]

    code = models.CharField(max_length=12, unique=True, editable=False)
    invitation_type = models.CharField(max_length=7, choices=TYPES)
    department = models.ForeignKey(
        'university.Department',
        on_delete=models.CASCADE,
        related_name='invitations'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_invitations'
    )
    expires_at = models.DateTimeField()
    max_uses = models.PositiveIntegerField(default=1)
    used_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['expires_at', 'used_count']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.code} ({self.invitation_type})"

    @property
    def is_valid(self):
        return self.used_count < self.max_uses and self.expires_at > timezone.now()

    def clean(self):
        super().clean()
        if self.department.hod != self.created_by:
            raise ValidationError(
                "Only the department HOD can create invitations"
            )
        if self.expires_at <= timezone.now():
            raise ValidationError("Expiration must be in the future")

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = uuid.uuid4().hex[:12].upper()
        super().save(*args, **kwargs)