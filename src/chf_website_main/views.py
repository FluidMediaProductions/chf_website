import os
import requests
import json
import urllib.parse
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, get_object_or_404, reverse
from django.core.mail import EmailMessage
from django.template.loader import get_template
from .models import FrontPageSliderImage, HowWereDifferentPoint, Testimonial, Page
from .forms import ContactForm


def index(request):
    front_page_slides = FrontPageSliderImage.objects.all()
    how_were_different = HowWereDifferentPoint.objects.all().order_by('order')
    testimonials = Testimonial.objects.all()
    return render(request, "website_main/index.html",
                  {
                      "front_page_slides": front_page_slides,
                      "how_were_different": how_were_different,
                      "testimonials": testimonials
                  })


def properties(request):
    return render(request, "website_main/properties.html")


def properties_individual(request, house_id):
    return render(request, "website_main/property_individual.html", {
        "id": house_id
    })


def page(request, page_slug):
    return render(request, "website_main/page.html", {
        "page": get_object_or_404(Page, slug=page_slug)
    })


def properties_search(request):
    return render(request, "website_main/property_search.html", {
        "search": request.GET.get("search", "")
    })


def contact(request):
    form_class = ContactForm

    if request.method == 'POST':
        form = form_class(data=request.POST)

        if form.is_valid():
            contact_name = request.POST.get('contact_name', '')
            contact_email = request.POST.get('contact_email', '')
            contact_phone = request.POST.get('contact_phone', '')
            form_content = request.POST.get('content', '')

            # Email the profile with the
            # contact information
            template = get_template('website_main/contact_template.txt')
            context = {
                'contact_name': contact_name,
                'contact_email': contact_email,
                'contact_phone': contact_phone,
                'form_content': form_content,
            }
            content = template.render(context)

            site_config = SiteConfiguration.get_solo()

            email = EmailMessage(
                "New contact form submission",
                content,
                "<Your website CHF Estate agents> hello@fluidmedia.wales",
                [site_config.contact_email],
                reply_to=[contact_email]
            )
            email.send()
            msg = "Message successfully sent"
            return HttpResponseRedirect(reverse('contact') + "?" + urllib.parse.urlencode({"msg": msg}))

    return render(request, 'website_main/contact.html', {
        'form': form_class,
    })


def newsletter_add(request):
    if request.method == "POST":
        if request.POST.get("email", "").strip() != "" and request.POST.get("name", "").strip() != "":
            url = "https://api.mailerlite.com/api/v2/groups/7692157/subscribers"

            data = {
                'name': request.POST["name"],
                'email': request.POST["email"]
            }

            payload = json.dumps(data)

            headers = {
                'content-type': "application/json",
                'x-mailerlite-apikey': os.environ.get("MAILER_LITE_KEY", "")
            }

            response = requests.request("POST", url, data=payload, headers=headers)

            next_url = request.POST.get('next', '/')

            if response.status_code == 200:
                msg = "Successfully subscribed"
                msg_status = "success"
            else:
                msg = "There was an error. Please try again"
                msg_status = "danger"
            return HttpResponseRedirect(next_url + "?" + urllib.parse.urlencode({"msg": msg, "msg_status": msg_status}))
    return HttpResponse("")
