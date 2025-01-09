# Generated by Django 5.1.4 on 2024-12-20 06:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_card_date_remove_card_time_card_card_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='created_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='card',
            name='card_id',
            field=models.CharField(default='', max_length=100, unique=True),
        ),
    ]