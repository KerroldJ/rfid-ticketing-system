# Generated by Django 5.1.4 on 2025-01-02 20:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_userprofile'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='card',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='card',
            name='deactivated_at',
        ),
    ]
