# # users/signals.py
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from university.models import College, Department
# from .models import Role
# from django.apps import apps
# @receiver(post_save, sender=College)
# def create_college_roles(sender, instance, created, **kwargs):
#     if created:
#         # Create college-level roles
#         Role.objects.get_or_create(
#             name='PRINCIPAL',
#             college=instance,
#             department=None
#         )
#         Role.objects.get_or_create(
#             name='ADMIN',
#             college=instance,
#             department=None
#         )

# @receiver(post_save, sender=Department)
# def create_department_roles(sender, instance, created, **kwargs):
#     if created:
#         # Create department-level roles
#         Role.objects.get_or_create(
#             name='HOD',
#             college=instance.college,
#             department=instance
#         )
#         Role.objects.get_or_create(
#             name='FACULTY',
#             college=instance.college,
#             department=instance
#         )
#         Role.objects.get_or_create(
#             name='STUDENT',
#             college=instance.college,
#             department=instance
#         )

# @receiver(post_save, sender=apps.get_model('university', 'Department'))
# def assign_hod_role(sender, instance, **kwargs):
#     Role = apps.get_model('users', 'Role')
#     User = apps.get_model('users', 'User')
    
#     if instance.hod:
#         # Create/assign HOD role
#         role, _ = Role.objects.get_or_create(
#             name='HOD',
#             department=instance,
#             college=instance.college
#         )
#         instance.hod.roles.add(role)
        
#         # Update user's department
#         User.objects.filter(pk=instance.hod.pk).update(
#             department=instance,
#             college=instance.college
#         )

# @receiver(post_save, sender=apps.get_model('university', 'Department'))
# def handle_hod_assignment(sender, instance, **kwargs):
#     Role = apps.get_model('users', 'Role')
#     User = apps.get_model('users', 'User')
    
#     if instance.hod:
#         # Create/update HOD role
#         role, _ = Role.objects.update_or_create(
#             name='HOD',
#             department=instance,
#             defaults={'college': instance.college}
#         )
        
#         # Assign role and update user
#         instance.hod.roles.add(role)
#         User.objects.filter(pk=instance.hod.pk).update(
#             department=instance,
#             college=instance.college
#         )
# users/signals.py (updated)
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=User)
def set_default_role(sender, instance, created, **kwargs):
    """Set default role for new users if not provided"""
    if created and not instance.role:
        instance.role = 'STUDENT'  # Use direct role assignment
        instance.save()