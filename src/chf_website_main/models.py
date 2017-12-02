from django.db import models
from django.template.defaultfilters import slugify
from solo.models import SingletonModel


class SiteConfiguration(SingletonModel):
    site_name = models.CharField(max_length=255, default='CHF Estate Agents')
    slogan = models.CharField(max_length=255, default='Move with the times')
    contact_email = models.EmailField(default="sales@chf.uk.com")
    contact_phone = models.CharField(max_length=20, default="(01633) 881 844")
    address = models.TextField(max_length=255, default="Salisbury House, The Square, Magor, Newport, NP26 3HY")


class FrontPageSliderImage(models.Model):
    img = models.ImageField("Slide", upload_to='media/%Y/%m/%d/')

    def __str__(self):
        return self.img.name


class HowWereDifferentPoint(models.Model):
    name = models.CharField(max_length=255)
    img = models.ImageField("Icon", upload_to='media/%Y/%m/%d/')
    desc = models.TextField("Description")
    order = models.IntegerField()

    def __str__(self):
        return self.name


class Testimonial(models.Model):
    name = models.CharField(max_length=255)
    img = models.ImageField("Testimonial", upload_to='media/%Y/%m/%d/')

    def __str__(self):
        return self.name


class SocialMedia(models.Model):
    name = models.CharField(max_length=255)
    icon = models.CharField("FA Icon Name", max_length=50)
    link = models.URLField()
    colour = models.CharField("CSS colour code", max_length=50)

    def __str__(self):
        return self.name


class BusinessPartner(models.Model):
    name = models.CharField(max_length=200)
    img = models.ImageField("Logo", upload_to='media/%Y/%m/%d/')
    url = models.URLField("Link", null=True)

    def __str__(self):
        return self.name


class Page(models.Model):
    title = models.CharField(max_length=255)
    slug = models.CharField(unique=True, max_length=255)
    content = models.TextField()

    def save(self, *args, **kwargs):
        if not self.id:
            # Newly created object, so set slug
            self.slug = slugify(self.title)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
