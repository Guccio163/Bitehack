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
import pytz

utc=pytz.UTC

# Create your views here.
@api_view()
def test(request):
    return Response("No siemka")


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
        serializer = SiteVisitSerializer(instance=SiteVisit(), data=data)
        
        if serializer.is_valid():
            serializer.save()
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
            visits_aggregated[key] = visits_aggregated.get(key, visit["end_date"] - visit["start_date"])
    
        return visits_aggregated
    
    def _duration(self, visit):
        print(visit)
        return visit["end_date"] - visit["start_date"]


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