from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .models import User, SiteVisit
from .serializers import RegisterSerializer, AuthTokenSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from .serializers import SiteVisitSerializer

from datetime import datetime, timedelta


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


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class SiteVisits(ListAPIView):
    serializer_class = SiteVisitSerializer

    def get_queryset(self):
        start_param = self.request.query_params.get('start')
        end_param = self.request.query_params.get('end')
        start_date = datetime.strptime(start_param, '%Y-%m-%d %H:%M:%S') if start_param else None
        end_date = datetime.strptime(end_param, '%Y-%m-%d %H:%M:%S') if end_param else None

        visits = SiteVisit.objects.all()

        visits_aggregated = self._aggregate_visits(visits, start_date, end_date)

        return visits_aggregated

    # Returns a dictionary where (key, value) = (site_name, aggregated_time_spent)
    # Considers only site visits made between start_date and end_date
    def _aggregate_visits(self, visits, start_date, end_date):
        visits_filtered = visits.filter(
            lambda v: (start_date is None or v.start_date >= start_date) and (end_date is None or v.end_date <= end_date
        ))
        visits_aggregated = {}
        for visit in visits_filtered:
            key = visit.site_name()
            visits_aggregated[key] = visits_aggregated.get(key, visit.duration())

        return {key: str(value) for key, value in visits_aggregated}