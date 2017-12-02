# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-08-26 14:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chf_website_main', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BusinessPartner',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('img', models.ImageField(upload_to='media/%Y/%m/%d/', verbose_name='Logo')),
            ],
        ),
    ]