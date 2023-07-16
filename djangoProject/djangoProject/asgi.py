"""
ASGI config for djangoProject project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

if 'DJANGO_LOCAL_DEV' in os.environ:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoProject.settings')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoProject.prod_settings')

application = get_asgi_application()
