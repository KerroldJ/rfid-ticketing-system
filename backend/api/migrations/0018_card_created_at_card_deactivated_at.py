# Generated by Django 5.1.4 on 2025-01-02 20:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_remove_card_created_at_remove_card_deactivated_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='card',
            name='deactivated_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
