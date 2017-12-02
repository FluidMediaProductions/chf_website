from .models import BusinessPartner, SiteConfiguration, SocialMedia, Page


def processor(request):
    return {
        'partners': BusinessPartner.objects.all(),
        'site_config': SiteConfiguration.get_solo(),
        'social_media': SocialMedia.objects.all(),
        'msg': request.GET.get("msg", False),
        'msg_status': request.GET.get("msg_status", False),
        'pages': Page.objects.all()
    }
