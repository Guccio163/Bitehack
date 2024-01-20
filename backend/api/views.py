from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .models import User, SiteVisit, BlockedSite
from .serializers import RegisterSerializer, AuthTokenSerializer
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.views import APIView
from .serializers import SiteVisitSerializer, BlockedSiteSerializer

from datetime import datetime, timedelta


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
        })


class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class SiteVisitsView(APIView):
    serializer_class = SiteVisitSerializer
    # permission_classes = (IsAuthenticated,)
    def get(self, request, format=None):
        _, key = self.request.META.get('HTTP_AUTHORIZATION').split(' ')
        user = Token.objects.get(key=key).user
        start_param = self.request.query_params.get('start')
        end_param = self.request.query_params.get('end')

        start_date = datetime.fromisoformat(start_param)
        end_date = datetime.fromisoformat(end_param)
        
        visits = SiteVisit.objects.filter(user=user).values()

        return Response(self._aggregate_visits(visits, start_date, end_date))
    
    def post(self, request, format=None):
        _, key = self.request.META.get('HTTP_AUTHORIZATION').split(' ')
        user = Token.objects.get(key=key).user
        
        data = request.data
        data['user'] = user.id
        print("Z requesta: ", data)
        serializer = SiteVisitSerializer(instance=SiteVisit(), data=data)
        
        if serializer.is_valid():
            serializer.save()
            print("Do bazy danych ", serializer.data)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Returns a dictionary where (key, value) = (site_name, aggregated_time_spent)
    # Considers only site visits made between start_date and end_date
    def _aggregate_visits(self, visits, start_date, end_date):
        visits_filtered = [v for v in visits
                if (start_date is None or v['start_date'] >= start_date) and (end_date is None or v["end_date"] <= end_date)]


        visits_aggregated = {}
        for visit in visits_filtered:
            key = visit['site_url']
            visits_aggregated[key] = visits_aggregated.get(key, 0) + visit["end_date"] - visit["start_date"]
    
        return visits_aggregated



class BlockSiteView(APIView):
    # permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        _, key = self.request.META.get('HTTP_AUTHORIZATION').split(' ')
        user = Token.objects.get(key=key).user

        blocked_sites = BlockedSite.objects.filter(user=user)
        serializer = BlockedSiteSerializer(blocked_sites, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        _, key = self.request.META.get('HTTP_AUTHORIZATION').split(' ')
        user = Token.objects.get(key=key).user
        
        data = request.data
        data['user'] = user.id
        serializer = BlockedSiteSerializer(instance=BlockedSite(), data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

    def delete(self, request, pk, format=None):
        blocked_site = BlockedSite.objects.get(pk=pk)
        blocked_site.delete()

        return Response("Blocked site deleted")

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
        
        blocked_sites_urls_counts = {b.site_url: {"daily_usage": b.daily_usage, "time": timedelta(0), "count": 0} for b in blocked_sites}
        return Response(self._aggregate_visits(visits, blocked_sites_urls_counts))
     
     def _aggregate_visits(self, visits, blocked_sites_urls_counts):
        visits_aggregated = blocked_sites_urls_counts
        
        for visit in visits:
            key = visit['site_url']
            visits_aggregated[key]["time"] += visit["end_date"] - visit["start_date"]
            visits_aggregated[key]["count"] += 1

        return visits_aggregated

# const testApi = async () => {
#     let x = new Date()
#     x = new Date(x.getTime() - 89 * 60 * 1000);
#     const url = `/sites/`  
#     const model = {
#       site_url: "https://opera.com/",
#       start_date: x,
#       end_date: new Date()
#     }
#     // await axios.post(url, model)
#     //     .then(response => {
#     //       const data = response.data
#     //       console.log(data);
          
#     //     })
#     //     .catch(error => {
#     //         console.log(error);
#     //     })
    
#     await axios
#       .get(url, { params:
#       {
#         end: new Date(),
#         start: new Date(x.getTime() - 24 * 60 * 60 * 1000)
#       }})
#         .then(async response => {
#             const data = response.data
#             console.log("git")
#             console.log(data)
#         })
#         .catch(error => {
#             console.log(error);
#         })
#    }