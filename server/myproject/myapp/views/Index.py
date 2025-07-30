import os
from django.shortcuts import render
from django.conf import settings

STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET')


def IndexView(request):
    # print(STRIPE_SECRET_KEY)
    return render(request, 'base.html')