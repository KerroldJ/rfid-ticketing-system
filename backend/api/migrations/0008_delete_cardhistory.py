# Generated by Django 5.1.4 on 2024-12-21 16:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_remove_cardhistory_action_type_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CardHistory',
        ),
    ]
