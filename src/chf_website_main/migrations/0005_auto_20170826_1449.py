# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-08-26 14:49
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chf_website_main', '0004_siteconfiguration'),
    ]

    operations = [
        migrations.AlterField(
            model_name='siteconfiguration',
            name='address',
            field=models.TextField(default='Salisbury House, The Square, Magor, Newport, NP26 3HY', max_length=255),
        ),
        migrations.AlterField(
            model_name='siteconfiguration',
            name='contact_email',
            field=models.EmailField(default='sales@chf.uk.com', max_length=254),
        ),
        migrations.AlterField(
            model_name='siteconfiguration',
            name='contact_phone',
            field=models.CharField(default='(01633) 881 844', max_length=20),
        ),
        migrations.AlterField(
            model_name='siteconfiguration',
            name='facebook',
            field=models.URLField(default='https://www.facebook.com/CrookHudsonFlynn/'),
        ),
        migrations.AlterField(
            model_name='siteconfiguration',
            name='instagram',
            field=models.URLField(default='https://www.instagram.com/chf_magor/'),
        ),
        migrations.AlterField(
            model_name='siteconfiguration',
            name='twitter',
            field=models.URLField(default='https://twitter.com/chfmagor'),
        ),
        migrations.AlterField(
            model_name='siteconfiguration',
            name='youtube',
            field=models.URLField(default='https://www.youtube.com/channel/UCzuCyEBiwxZjpkw8yMPwUrw'),
        ),
    ]
