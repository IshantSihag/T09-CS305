from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignUpViewSerializer, MyTokenObtainPairSerializer,ProfileViewSerializer
from .models import UserProfile
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView


class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer
# Create your views here.

class HomeView(APIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        content = {'message': 'Welcome to the JWT Authentication page using React Js and Django!'}
        return Response(content)

class LogoutView(APIView):
     permission_classes = (IsAuthenticated,)
     def post(self, request):
          try:
               refresh_token = request.data["refresh_token"]
               token = RefreshToken(refresh_token)
               token.blacklist()
               return Response(status=status.HTTP_205_RESET_CONTENT)
          except Exception as e:
               return Response(status=status.HTTP_400_BAD_REQUEST)

class SignUpView(APIView):
     def post(self, request):
          serializer = SignUpViewSerializer(data=request.data)
          serializer.is_valid(raise_exception=True)
          serializer.save()
          return Response(serializer.data, status=status.HTTP_201_CREATED)
     
class ProfileView(APIView):
     def get(self,request):
          try:
               username_ = request.GET.get("username")
               print(username_)
               queryset_=UserProfile.objects.get(username=username_)
               serialiser=ProfileViewSerializer(queryset_,many=True)
               if(serialiser.data['type']=="Student"):
                    return Response(serialiser.data,status=status.HTTP_200_OK)
               else:
                    return Response(status=status.HTTP_404_NOT_FOUND)

          except Exception as e:
               print(str(e))
               return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
          