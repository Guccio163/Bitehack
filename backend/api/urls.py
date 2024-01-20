from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.CustomAuthToken.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
]