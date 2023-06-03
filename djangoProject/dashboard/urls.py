from django.urls import path
from . import views

urlpatterns = [
    path('index/', views.index, name='home'),
    path('uploadfile/', views.saveToDb, name='upload'),
    path('get_csrf_token/', views.csrf, name='csrf'),
]




