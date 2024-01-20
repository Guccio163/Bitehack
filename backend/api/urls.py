from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.CustomAuthToken.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('blocksite/', views.BlockSiteView.as_view(methods=['GET', 'POST']), name='blocksite'),
    path('blocksite/<int:pk>/', views.BlockSiteView.as_view(methods=['PUT', 'DELETE']), name='blocksite_update'),
]