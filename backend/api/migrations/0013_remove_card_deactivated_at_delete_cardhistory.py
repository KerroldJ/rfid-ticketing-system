# Generated by Django 5.1.4 on 2024-12-21 18:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_cardhistory'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='card',
            name='deactivated_at',
        ),
        migrations.DeleteModel(
            name='CardHistory',
        ),
    ]