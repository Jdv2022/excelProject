from django.urls import path
from . import views

urlpatterns = [
    path('index/', views.index, name='home'),
    path('uploadfile/', views.saveToDb, name='upload'),
    path('get_csrf_token/', views.csrf, name='csrf'),
    path('api/worldtour/', views.worldTour, name='world-tour-api'),
    path('api/ph/', views.phMap, name='ph-map-api'),
    path('api/philippinesmap/', views.Philippines, name='philippinesmap-map-api'),
    path('api/phregion/', views.phRegion, name='phregion-map-api'),
]




