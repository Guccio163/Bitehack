from django.http import HttpResponse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.
@api_view()
def test(request):
    return Response("No siemka")
