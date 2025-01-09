# Generated by Django 5.1.4 on 2025-01-04 12:28

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0036_alter_deactivatedcard_card_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='log',
            name='time',
            field=models.TimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='log',
            name='type',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
