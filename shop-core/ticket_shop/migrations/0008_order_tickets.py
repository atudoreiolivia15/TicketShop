# Generated by Django 5.1.2 on 2024-12-03 13:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ticket_shop', '0007_remove_event_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='tickets',
            field=models.ManyToManyField(blank=True, to='ticket_shop.ticket'),
        ),
    ]
