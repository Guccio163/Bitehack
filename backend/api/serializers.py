from rest_framework import serializers

from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

from .models import User, SiteVisit, BlockedSite
from django.contrib.auth import authenticate


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class AuthTokenSerializer(serializers.Serializer):
    password = serializers.CharField()
    username = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        request = self.context.get('request'),

        user = authenticate(
            request=request,
            username=username,
            password=password
        )

        if not user:
            msg = ('Unable to authenticate with provided credentials')
            raise serializers.ValidationError(msg, code='authentication')

        attrs['user'] = user
        return attrs


class SiteVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteVisit
        fields = '__all__'

    def create(self, validated_data, user):
        site = SiteVisit.objects.create(
            user = user,
            site_url = validated_data['site_url'],
            start_date = validated_data['start_date'],
            end_date = validated_data['end_date']
        )

        site.save()

        return user

class BlockedSiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedSite
        fields = '__all__'

    
    def create(self, validated_data, user):
        blocked_site = BlockedSite.objects.create(
            user = user,
            site_url = validated_data['site_url'],
            daily_usage = validated_data['daily_usage'],
        )

        blocked_site.save()

        return user
    
    def update(self, instance, validated_data): 
        instance.daily_usage = validated_data.get('daily_usage', instance.daily_usage)
        instance.blocked_count = validated_data.get('blocked_count', instance.blocked_count)
        instance.save()
        return instance
