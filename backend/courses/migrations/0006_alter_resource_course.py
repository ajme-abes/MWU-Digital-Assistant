# Generated by Django 5.2 on 2025-04-20 08:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0005_resource_description_resource_rejection_reason'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resource',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='resources', to='courses.course'),
        ),
    ]
