from django.urls import path
from django.conf.urls import re_path

from . import views

urlpatterns = [
    re_path(r'^get_data/$', views.get_data, name = 'get_data'),
    re_path(r'^post_data/$', views.post_data, name = 'post_data')
]
