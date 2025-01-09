# Generated by Django 5.1.4 on 2025-01-02 23:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_rename_deactivated_date_card_created_date_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='DeactivatedCard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('card_id', models.CharField(max_length=100, unique=True)),
                ('status', models.CharField(max_length=15)),
                ('deactivated_date', models.DateField()),
                ('deactivated_time', models.CharField(max_length=10)),
            ],
        ),
    ]
