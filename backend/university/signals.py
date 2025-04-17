from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Department
from django.core.exceptions import ValidationError

@receiver(pre_save, sender=Department)
def validate_hod(sender, instance, **kwargs):
    if instance.hod and instance.hod.department != instance:
        raise ValidationError("HOD must belong to the department")