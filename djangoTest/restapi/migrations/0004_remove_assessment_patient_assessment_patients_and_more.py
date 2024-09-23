# Generated by Django 5.1.1 on 2024-09-20 00:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0003_alter_assessment_table'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='assessment',
            name='patient',
        ),
        migrations.AddField(
            model_name='assessment',
            name='patients',
            field=models.ManyToManyField(to='restapi.patient'),
        ),
        migrations.AlterField(
            model_name='assessment',
            name='final_score',
            field=models.IntegerField(),
        ),
    ]
