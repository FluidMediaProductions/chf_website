from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^properties/$', views.properties, name="properties"),
    url(r'^properties/search/$', views.properties_search, name="properties_search"),
    url(r'^properties/(?P<house_id>[0-9]+)/$', views.properties_individual, name="properties_individual"),
    url(r'^newsletter/add/$', views.newsletter_add, name="newsletter_add"),
    url(r'^page/(?P<page_slug>[-\w]+)/$', views.page, name="page"),
    url(r'^contact/$', views.contact, name="contact"),
]