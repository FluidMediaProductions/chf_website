from django.contrib import admin
from solo.admin import SingletonModelAdmin
from .models import FrontPageSliderImage,\
    BusinessPartner,\
    SiteConfiguration,\
    HowWereDifferentPoint,\
    Testimonial,\
    SocialMedia,\
    Page
from .forms import PageForm


class PageAdmin(admin.ModelAdmin):
    form = PageForm
    fields = ['title', 'slug', 'content']

    class Media:
        js = (
            'https://code.jquery.com/jquery-3.2.1.min.js',
        )
        css = {
            'all': ('css/froala.min.css',)
        }


# Register your models here.

admin.site.register(SiteConfiguration, SingletonModelAdmin)
admin.site.register(FrontPageSliderImage)
admin.site.register(BusinessPartner)
admin.site.register(HowWereDifferentPoint)
admin.site.register(Testimonial)
admin.site.register(SocialMedia)
admin.site.register(Page, PageAdmin)
