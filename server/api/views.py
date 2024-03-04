from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignUpViewSerializer, MyTokenObtainPairSerializer,ProfileViewSerializer,UpdateUserProfileSerializer
from .models import UserProfile
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User

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
     permission_classes = (IsAuthenticated,)
     def get(self,request):
          try:
               username = request.GET.get("username")
               print(username)
               user=User.objects.get(username=username)
               # print(user.email)
               # userProfile=UserProfile.objects.get(user=user)
               serialiser=ProfileViewSerializer(user,many=False)
               print(serialiser.data)
               if(serialiser.data['userdetails']['type']=="student"):
                    return Response(serialiser.data,status=status.HTTP_200_OK)
               elif(serialiser.data['userdetails']['type']=="institute"):
                    return Response(serialiser.data,status=status.HTTP_200_OK)
               else:
                    return Response(status=status.HTTP_404_NOT_FOUND)
          except Exception as e:
               print(str(e))
               return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
          
class UpdateProfileView(APIView):
     permission_classes = (IsAuthenticated,)
     def post(self,request):
          jsonresponse={
               "ok":False,
               "message":"error"
          }
          try:

               try:
                    user = User.objects.get(email=request.data['email'])
               except User.DoesNotExist:
                    jsonresponse["message"] = "No user with the given email"
                    return Response(jsonresponse, status=status.HTTP_404_NOT_FOUND)
               userProfile=UserProfile.objects.get(user_id=user.id)
               serializer=UpdateUserProfileSerializer(userProfile,data=request.data)
               if not serializer.is_valid():
                    print("invalid data")
                    jsonresponse["message"]="invalid data"
                    return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
               serializer.save()
               jsonresponse={
                    "ok":True,
                    "message":"successfully updated"
               }
               return Response(jsonresponse,status=status.HTTP_200_OK)
          except Exception as e:
               print(e)
               return Response(jsonresponse,status=status.HTTP_500_INTERNAL_SERVER_ERROR)

          