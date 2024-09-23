from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Patient Model (assuming it's already created)
class Patient(models.Model):
    clinician = models.ForeignKey(User, on_delete=models.CASCADE, default=1)  # Link patient to clinician (user)
    full_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    address = models.TextField()

    class Meta:
        db_table = 'patient_table'  # Specify the exact table name in the database
        
# Assessment Model
class Assessment(models.Model):
    ASSESSMENT_TYPES = [
        ('Cognitive Status', 'Cognitive'),
        ('Physical Health', 'Physical'),
        ('Mental Health', 'Mental'),
        ('Nutrition', 'Nutrition'),
        ('Other', 'Other'),
        # Add more types as needed
    ]

    clinician = models.ForeignKey(User, on_delete=models.CASCADE, default=1)  # Link assessment to clinician (user)
    assessment_type = models.CharField(max_length=50, choices=ASSESSMENT_TYPES)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, default=1)
    assessment_date = models.DateField()
    questions_and_answers = models.JSONField()  # Stores Q&A as JSON
    final_score = models.FloatField()

    def __str__(self):
        return f"{self.patient.full_name}'s {self.get_assessment_type_display()} assessment on {self.assessment_date}"
    
    class Meta:
        db_table = 'assessment_table'  # Specify the exact table name in the database