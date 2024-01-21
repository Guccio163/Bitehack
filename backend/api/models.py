from django.db.models import DateTimeField
from django.db import models
from rest_framework.authtoken.models import Token

from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

from urllib.parse import urlparse

# @receiver(post_save, sender=settings.AUTH_USER_MODEL)
# def create_auth_token(sender, instance=None, created=False, **kwargs):
#     if created:
#         Token.objects.create(user=instance)


class UserManager(BaseUserManager):
    def create_user(self, email, username, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have username")
        if not first_name:
            raise ValueError("Users must have username")
        if not last_name:
            raise ValueError("Users must have username")
        user = self.model(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, first_name, last_name, password=None,  **extra_fields):
        user = self.create_user(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(db_index=True, unique=True, max_length=255)
    username = models.CharField(max_length=255, db_index=True, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    date_joined = models.DateTimeField(
        verbose_name='date joined', auto_now_add=True)

    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        db_table = "user"

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

class DateTimeWithoutTZField(DateTimeField):
    def db_type(self, connection):
        return 'timestamp'
    
# Create your models here.
class SiteVisit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    site_url = models.CharField(max_length=255)
    start_date = DateTimeWithoutTZField()
    end_date = DateTimeWithoutTZField()

    def duration(self):
        return self.end_date - self.start_date

    # ?
    def site_name(self):
        return urlparse(self.site_url).netloc.split('.')[1]


class BlockedSite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    site_url = models.CharField(max_length=255)
    daily_usage = models.IntegerField(default=0)
    blocked_count = models.IntegerField(default=0)
    date_joined = models.DateTimeField(auto_now_add=True)
