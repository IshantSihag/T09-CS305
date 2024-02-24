from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignUpViewSerializer, MyTokenObtainPairSerializer, UserProfileSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Test, UserProfile
from django.contrib.auth.models import User
from rest_framework.decorators import api_view


class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer
        
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            if serializer.is_valid():
                username = request.data["email"]
                type = request.data["type"]
                user_profile = UserProfile.objects.get(username=username, type=type)
                user_profile_serializer = UserProfileSerializer(user_profile, many=False)
                user_profile_serializer = user_profile_serializer.data
                tests = user_profile_serializer['tests']
                jsonresponse = {
                    "ok": True,
                    "access": serializer.validated_data['access'],
                    "refresh": serializer.validated_data['refresh'],
                    "type": user_profile_serializer['type'],
                    "name": user_profile_serializer['name'],
                    "email": user_profile_serializer['email'],
                    "profile_url": user_profile_serializer['profile_url'],
                    "bio": user_profile_serializer['bio'],
                    "expires_in": 3600,
                }
                return Response(jsonresponse, status=status.HTTP_200_OK)
        except:
            jsonresponse = {
                "ok": False,
                "error": "Invalid email or password"
            }
            return Response(jsonresponse, status=status.HTTP_401_UNAUTHORIZED)


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
     
class getTest(APIView):
     permission_classes = (IsAuthenticated, )
     def get(self, request):
          institutename = request.get.GET('username')
          tests = Test.objects.filter(institutename=institutename)
          jsonresponse = []
          
          for test in tests:
               jsonresponse.append({
                    'start': test.start,
                    'duration': test.duration,
                    'author': test.author,
                    'questions': test.registrations.split(','),
                    'is_public': test.is_public,
                    'registrations': test.registrations.split(','),
               })
               
          return jsonresponse