from django import forms
from froala_editor.widgets import FroalaEditor
from django.templatetags.static import static
from .models import Page


class PageForm(forms.ModelForm):
    slug = forms.CharField(widget=forms.TextInput(attrs={'readonly': 'True'}), required=False)
    content = forms.CharField(widget=FroalaEditor(options={
        "heightMin": 200,
        "iframeStyleFiles": [static('css/bootstrap.min.css'), static('css/main.min.css')],
        "iframe": True
    }, image_upload=True))

    class Meta:
        model = Page
        fields = ('title', 'content', 'slug')


class ContactForm(forms.Form):
    contact_name = forms.CharField(required=True)
    contact_email = forms.EmailField(required=True)
    contact_phone = forms.IntegerField(required=True)
    content = forms.CharField(
        required=True,
        widget=forms.Textarea
    )
