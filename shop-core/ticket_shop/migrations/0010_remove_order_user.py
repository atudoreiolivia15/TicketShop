# Generated by Django 5.1.2 on 2024-12-05 20:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ticket_shop', '0009_rename_fullname_order_full_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='user',
        ),
    ]
