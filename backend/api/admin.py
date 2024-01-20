from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, SiteVisit, BlockedSite

class CustomUserAdmin(UserAdmin):
    list_display = ('id','email','username','first_name','last_name', 'is_admin', 'is_staff', 'is_active', 'is_superuser', 'date_joined')
    search_fields = ('id','email','username','first_name','last_name')

admin.site.register(User,CustomUserAdmin)
admin.site.register(SiteVisit)
admin.site.register(BlockedSite)