from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

from rest_framework.permissions import BasePermission



urlpatterns =[
    # path('login/', views.LoginView.as_view(), name='login'),
    # path('register/', views.RegisterView.as_view(), name='register_user'),
    # # path('gettoken/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
]