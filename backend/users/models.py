# from django.db import models
# from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
# from django.utils import timezone
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.db.models import Q
# from django.apps import apps

# # users/models.py
# class Role(models.Model):
#     ROLE_CHOICES = [
#         ('PRINCIPAL', 'Principal'),
#         ('HOD', 'Department Head'),
#         ('FACULTY', 'Faculty Member'),
#         ('STUDENT', 'Student'),
#         ('ADMIN', 'College Administrator'),
#         ('LIBRARY', 'Library Staff'),
#         ('FINANCE', 'Finance Officer'),
#     ]
    
#     name = models.CharField(max_length=20, choices=ROLE_CHOICES)
#     college = models.ForeignKey('university.College', on_delete=models.CASCADE, null=True)
#     department = models.ForeignKey('university.Department', on_delete=models.CASCADE, null=True)

#     class Meta:
#         constraints = [
#             models.UniqueConstraint(
#                 name='unique_college_role',
#                 fields=['name', 'college'],
#                 condition=Q(department__isnull=True),
#             ),
#             models.UniqueConstraint(
#                 name='unique_department_role',
#                 fields=['name', 'department'],
#                 condition=Q(department__isnull=False),
#             )
#         ]

#     def __str__(self):
#         if self.department:
#             return f"{self.get_name_display()} of {self.department.code}"
#         return f"{self.get_name_display()} of {self.college.code}"

# class UserManager(BaseUserManager):
#     def create_user(self, email, password=None, **extra_fields):
#         email = self.normalize_email(email)
#         user = self.model(email=email, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, password, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)
#         return self.create_user(email, password, **extra_fields)

# class User(AbstractBaseUser, PermissionsMixin):
#     email = models.EmailField(unique=True)
#     roles = models.ManyToManyField(Role, related_name='users')
#     department = models.ForeignKey(
#         'university.Department',
#           null=True, 
#           on_delete=models.PROTECT,
#           related_name='members'
#           )
#     college = models.ForeignKey('university.College', null=True, on_delete=models.PROTECT)

#     is_staff = models.BooleanField(default=False)
#     is_active = models.BooleanField(default=True)
#     date_joined = models.DateTimeField(default=timezone.now)
#     USERNAME_FIELD = 'email'
#     objects = UserManager()

#     def __str__(self):
#         return self.email

# @receiver(post_save, sender='university.Department')
# def assign_hod_role(sender, instance, **kwargs):
#     Role = apps.get_model('users', 'Role')
#     User = apps.get_model('users', 'User')
#     if instance.hod:
#         role, created = Role.objects.get_or_create(
#             name='HOD',
#             department=instance,
#             college=instance.college
#         )
#         instance.hod.roles.add(role)
#         User.objects.filter(pk=instance.hod.pk).update(
#             department=instance,
#             college=instance.college
#         )
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
from core.permissions import RoleChoices

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', RoleChoices.ADMIN)
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=10,
        choices=RoleChoices.choices,
        default=RoleChoices.STUDENT
    )
    department = models.ForeignKey(
        'university.Department',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = UserManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['department'],
                condition=models.Q(role=RoleChoices.HOD),
                name='unique_hod_per_department'
            ),
            models.UniqueConstraint(
                fields=['email'],
                name='unique_email'
            )
        ]

    def __str__(self):
        return self.email

    @property
    def college(self):
        """Derived property through department relationship"""
        return self.department.college if self.department else None