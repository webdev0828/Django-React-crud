# Generated by Django 5.1.1 on 2024-09-20 15:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0005_remove_assessment_patients_assessment_patient_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='assessment',
            name='clinician',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='assessment',
            name='assessment_type',
            field=models.CharField(choices=[('Cognitive Status', 'Cognitive'), ('Physical Health', 'Physical'), ('Mental Health', 'Mental'), ('Nutrition', 'Nutrition'), ('Other', 'Other')], max_length=50),
        ),
    ]
