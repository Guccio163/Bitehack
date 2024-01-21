from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .models import User, SiteVisit, BlockedSite
from .serializers import RegisterSerializer, AuthTokenSerializer
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from urllib.parse import urlparse
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.views import APIView
from .serializers import SiteVisitSerializer, BlockedSiteSerializer

from datetime import datetime, timedelta

# tutaj można się logować, daje się username i hasło a zwraca token do późniejszej autentykacji
class CustomAuthToken(ObtainAuthToken, generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = AuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'date_joined': user.date_joined
        })


# służy do registrowania się - jak ktoś da imie nazwisko, username, email i dwa takie same hasła to się go stworzy - większość roboty robi serializer
class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


# do tworzenia i pobierania historii odwiedzanych stron
class SiteVisitsView(APIView):
    serializer_class = SiteVisitSerializer

    # permission_classes = (IsAuthenticated,)

    #pobiera całą historie z podanego w paramsach okresu
    def get(self, request, format=None):
        _, key = self.request.META.get('HTTP_AUTHORIZATION').split(' ')
        user = Token.objects.get(key=key).user
        start_param = self.request.query_params.get('start')
        end_param = self.request.query_params.get('end')

        start_date = datetime.fromisoformat(start_param)
        end_date = datetime.fromisoformat(end_param)

        visits = SiteVisit.objects.filter(user=user, start_date__gte=start_date, end_date__lte=end_date).values()
        
        return Response(self._aggregate_visits(visits, start_date, end_date))

    # tworzy nowy wpis do tej tabeli (dostaje to od wtyczki jak wykreje ona zmianę okna itp)
    def post(self, request, format=None):
        _, key = self.request.META.get('HTTP_AUTHORIZATION').split(' ')
        user = Token.objects.get(key=key).user

        data = request.data
        data['user'] = user.id
        
        serializer = SiteVisitSerializer(instance=SiteVisit(), data=data)

        if serializer.is_valid():
            serializer.save()
        
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # dla aplikacji i wtyczki potrzebne, pomocna do geta
    def _aggregate_visits(self, visits, start_date, end_date):        
        
        visits_names = {v["site_url"] for v in visits
                           if (start_date is None or v['start_date'] >= start_date) and (
                                       end_date is None or v["end_date"] <= end_date)}
        
        result = []
        
        for k in visits_names:
            result.append({"name": k, "time": timedelta(0), "count": 0})
            for visit in visits:
                if visit["site_url"] != k: continue
                result[-1]["time"] += visit["end_date"] - visit["start_date"]
                result[-1]["count"] += 1

        return result


#zablokowane strony
class BlockSiteView(APIView):
    serializer_class = BlockedSiteSerializer

    # permission_classes = (IsAuthenticated,)
    #pobiera wszystkie
    def get(self, request, format=None):
        _, key = self.request.META.get('HTTP_AUTHORIZATION').split(' ')
        user = Token.objects.get(key=key).user

        blocked_sites = BlockedSite.objects.filter(user=user)
        serializer = BlockedSiteSerializer(blocked_sites, many=True)
        return Response(serializer.data)

    #blokuje nową
    def post(self, request, format=None):
        _, key = self.request.META.get('HTTP_AUTHORIZATION').split(' ')
        user = Token.objects.get(key=key).user

        data = request.data
        data['user'] = user.id

        serializer = BlockedSiteSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    #update np zmienia ograniczenie z 2h na strone na 90min na strone
    def put(self, request, pk, format=None):
        _, key = self.request.META.get('HTTP_AUTHORIZATION').split(' ')
        user = Token.objects.get(key=key).user

        data = request.data
        data['user'] = user.id
        blocked_site = BlockedSite.objects.get(pk=pk)
        serializer = BlockedSiteSerializer(blocked_site, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    #usuwa blokade
    def delete(self, request, pk, format=None):
        blocked_site = BlockedSite.objects.get(pk=pk)
        blocked_site.delete()

        return Response("Blocked site deleted")

#dodatkowe widoki, już nie związane szczególnie z jednym modelem - zwraca wszystkie blokade i to ile już dzisiaj ich wykorzystał
class LimitationView(APIView):
    def get(self, request, format=None):
        _, key = self.request.META.get('HTTP_AUTHORIZATION').split(' ')
        user = Token.objects.get(key=key).user

        blocked_sites = BlockedSite.objects.filter(user=user)
        blocked_sites_urls = [b.site_url for b in blocked_sites]

        today_date = datetime.now().date()
        visits = SiteVisit.objects.filter(site_url__in=blocked_sites_urls,
                                          start_date__year=today_date.year,
                                          start_date__month=today_date.month,
                                          start_date__day=today_date.day).values()

        
        blocked_sites_urls_counts = [[b.site_url, b.daily_usage, b.date_joined, b.id] for b in blocked_sites]
        
        return Response(self._aggregate_visits(visits, blocked_sites_urls_counts))

    def _aggregate_visits(self, visits, blocked_sites_urls_counts):
        visits_aggregated = []
        
        for blocked_url, daily_usage, date_joined, id in blocked_sites_urls_counts:
            visits_aggregated.append({"name": blocked_url, "data": {"daily_usage": daily_usage, "date_joined": date_joined, "time": timedelta(0), "count": 0, "pk": id}})
            for visit in visits:
                if visit["site_url"] != blocked_url: continue
                visits_aggregated[-1]["data"]["time"] += visit["end_date"] - visit["start_date"]
                visits_aggregated[-1]["data"]["count"] += 1

        return visits_aggregated