from django.urls import path
from .views import auth


url_patterns =[
    path('get_token/', auth.as_view())
]