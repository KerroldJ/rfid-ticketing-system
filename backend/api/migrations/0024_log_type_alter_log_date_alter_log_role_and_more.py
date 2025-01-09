# Generated by Django 5.1.4 on 2025-01-03 06:43

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_log'),
    ]

    operations = [
        migrations.AddField(
            model_name='log',
            name='type',
            field=models.CharField(choices=[('VIP', 'VIP'), ('Regular', 'Regular')], default='Regular', max_length=10),
        ),
        migrations.AlterField(
            model_name='log',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='log',
            name='role',
            field=models.CharField(default='Admin', max_length=50),
        ),
        migrations.AlterField(
            model_name='log',
            name='time',
            field=models.TimeField(default=django.utils.timezone.now),
        ),
    ]