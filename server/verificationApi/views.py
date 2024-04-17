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
from .models import UserImage, TestRating
import uuid


# Face verification utility methods
def find_face_encodings(base64_image):
    base64_image = base64_image.split(",")[1]
    decoded_data = base64.b64decode(base64_image)
    np_data = np.frombuffer(decoded_data, np.uint8)
    image = cv2.imdecode(np_data, cv2.IMREAD_COLOR)

    face_enc = face_recognition.face_encodings(image)
    if face_enc:
        print("FACE ENCODING FOUND:", len(face_enc))
        return face_enc[0], len(face_enc)
    else:
        print("FACE ENCODING NOT FOUND")
        return None, 0


def compare_face_encodings(known_face_enc, unknown_face_enc):
    result = face_recognition.compare_faces([known_face_enc], unknown_face_enc)
    return result[0]


def get_face_count(base64_image):
    base64_image = base64_image.split(",")[1]
    decoded_data = base64.b64decode(base64_image)
    np_data = np.frombuffer(decoded_data, np.uint8)
    image = cv2.imdecode(np_data, cv2.IMREAD_COLOR)

    face_enc = face_recognition.face_encodings(image)
    return len(face_enc)


class VerifyUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            user_pic_base64 = request.data["user_pic_base64"]
            user_email = request.user.email
            user = User.objects.get(email=user_email)
            user_image = UserImage.objects.get(user_id=user)
            user_initial_image = user_image.image_base64
            known_face_enc, _ = find_face_encodings(user_initial_image)
            # assert known_face_enc is not None # initial image not found
            unknown_face_enc, cnt = find_face_encodings(user_pic_base64)
            if cnt == 0:
                jsonresponse = {
                    "ok": True,
                    "verified": False,
                    "message": "No Face Found in the image",
                }
                return Response(jsonresponse, status=status.HTTP_200_OK)
            elif cnt > 1:
                jsonresponse = {
                    "ok": True,
                    "verified": False,
                    "message": "Multiple Faces Found in the image",
                }
                return Response(jsonresponse, status=status.HTTP_200_OK)
            result = compare_face_encodings(known_face_enc, unknown_face_enc)
            print("FACE VERIFICATION RESULT:", result)

            if result:
                jsonresponse = {
                    "ok": True,
                    "verified": True,
                    "message": "Face Verified",
                }
                return Response(jsonresponse, status=status.HTTP_200_OK)
            else:
                jsonresponse = {
                    "ok": True,
                    "verified": False,
                    "message": "Face didn't match",
                }
                return Response(jsonresponse, status=status.HTTP_200_OK)

        except:
            jsonresponse = {"ok": False, "error": "Invalid request"}
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)


class SubmitInitialImage(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if 1:
            user_pic_base64 = request.data["user_image_base64"]
            user_email = request.user.email
            user = User.objects.get(email=user_email)
            face_enc, cnt = find_face_encodings(user_pic_base64)
            if cnt == 0:
                jsonresponse = {"ok": False, "error": "No Face Found in the image"}
                return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
            elif cnt > 1:
                jsonresponse = {
                    "ok": False,
                    "error": "Multiple Faces Found in the image",
                }
                return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
            try:
                user_image = UserImage.objects.get(user_id=user)
            except UserImage.DoesNotExist:
                UserImage.objects.create(user_id=user, image_base64=user_pic_base64)
            user_image.image_base64 = user_pic_base64
            user_image.save()
            jsonresponse = {"ok": True, "message": "User profile picture saved"}
            return Response(jsonresponse, status=status.HTTP_200_OK)

        else:
            jsonresponse = {"ok": False, "error": "Invalid request"}
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)


class TestRatingView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            test_id = request.data["test_id"]
            uuid.UUID(request.data["test_id"])
            rating = request.data["rating"]
            suggestion = request.data["suggestion"]
            user_email = request.user.email
            user = User.objects.get(email=user_email)
            test = Test.objects.get(id=test_id)
            test_rating = TestRating.objects.create(
                test_id=test, rating=rating, suggestion=suggestion
            )
            jsonresponse = {"ok": True, "message": "Rating saved successfully"}
            return Response(jsonresponse, status=status.HTTP_200_OK)

        except:
            jsonresponse = {"ok": False, "error": "Invalid request"}
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)


class FetchTestView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            uuid.UUID(request.data["test_id"])
            test_id = request.data["test_id"]
        except:
            jsonresponse = {"ok": False, "error": "test_id required"}
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
        user_email = request.user.email
        if not Test.objects.filter(id=test_id).exists():
            jsonresponse = {"ok": False, "error": "Test not found"}
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
        test = Test.objects.get(id=test_id)
        if test.author == user_email:
            questions = []
            listquestions = Question.objects.filter(test_id=test_id)
            for question in listquestions:
                questions.append(
                    {
                        "id": question.id,
                        "statement": question.statement,
                        "type": question.type,
                        "marks": question.marks,
                        "options": question.options.split(","),
                        "answer": question.answer,
                    }
                )
            jsonresponse = {
                "ok": True,
                "start": test.start,
                "duration": test.duration,
                "author": test.author,
                "questions": questions,
            }
            return Response(jsonresponse, status=status.HTTP_200_OK)
        else:
            jsonresponse = {
                "ok": False,
                "error": "You are not authorized to view this test",
            }
            return Response(jsonresponse, status=status.HTTP_401_UNAUTHORIZED)
