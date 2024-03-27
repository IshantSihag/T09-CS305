from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from api.serializers import (
    SignUpViewSerializer,
    MyTokenObtainPairSerializer,
    ProfileViewSerializer,
    UserProfileSerializer,
)
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from api.models import Test, UserProfile, Question
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
import cv2
import face_recognition
import numpy as np
import base64
from .models import UserImage


# Face verification utility methods
def find_face_encodings(base64_image):
    decoded_data = base64.b64decode(base64_image)
    np_data = np.frombuffer(decoded_data, np.uint8)
    image = cv2.imdecode(np_data, cv2.IMREAD_COLOR)

    face_enc = face_recognition.face_encodings(image)
    if face_enc:
        return face_enc[0]
    else:
        return None


def compare_face_encodings(known_face_enc, unknown_face_enc):
    result = face_recognition.compare_faces([known_face_enc], unknown_face_enc)
    return result[0]


def get_face_count(base64_image):
    # to be implemented via API
    pass


class VerifyUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            user_pic_base64 = request.data["user_pic_base64"]
            user_email = request.user.email
            user = User.objects.get(email=user_email)
            user_image = UserImage.objects.get(user_id=user.id)
            user_initial_image = user_image.image_base64
            known_face_enc = find_face_encodings(user_initial_image)
            unknown_face_enc = find_face_encodings(user_pic_base64)
            if known_face_enc is None or unknown_face_enc is None:
                jsonresponse = {"ok": False, "error": "Invalid image"}
                return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
            result = compare_face_encodings(known_face_enc, unknown_face_enc)

            if result:
                jsonresponse = {"ok": True, "message": "User verified successfully"}
                return Response(jsonresponse, status=status.HTTP_200_OK)
            else:
                jsonresponse = {"ok": False, "error": "User verification failed"}
                return Response(jsonresponse, status=status.HTTP_401_UNAUTHORIZED)

        except:
            jsonresponse = {"ok": False, "error": "Invalid request"}
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)


class SubmitInitalImage(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            user_pic_base64 = request.data["user_image_base64"]
            user_email = request.user.email
            user = User.objects.get(email=user_email)
            user_image = UserImage.objects.get(user_id=user.id)
            user_image.image_base64 = user_pic_base64
            jsonresponse = {"ok": True, "message": "User profile picture saved"}
            return Response(jsonresponse, status=status.HTTP_200_OK)

        except:
            jsonresponse = {"ok": False, "error": "Invalid request"}
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
