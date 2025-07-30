

from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(["GET"])
def index(request):
    return Response({"message": "Welcome to the API root"})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('myapp.urls')), 
    path('auth/', include('social_django.urls', namespace='social')),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/', include('allauth.socialaccount.urls')),  # For social login
]
