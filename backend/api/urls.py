from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.CustomAuthToken.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('sites/', views.SiteVisitsView.as_view(), name="sites"),
    path('blocksite/', views.BlockSiteView.as_view(), name='blocksite'),
    path('blocksite/<int:pk>/', views.BlockSiteView.as_view(), name='blocksite_update'),
]