# Generated by Django 5.1.4 on 2025-01-02 23:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_card_created_at_card_deactivated_at'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='card',
            name='deactivated_at',
        ),
        migrations.AddField(
            model_name='card',
            name='deactivated_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='card',
            name='deactivated_time',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
