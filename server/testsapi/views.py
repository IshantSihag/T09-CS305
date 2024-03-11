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
from api.models import Test, UserProfile, Question, Result
from django.contrib.auth.models import User

# Create your views here.


class TestResultView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        email = request.user.email
        try:
            test_id = request.data["test_id"]
        except:
            # If test_id is not provided
            return Response(
                {
                    "ok": False,
                    "error": "test_id not provided",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        # If test_id is not valid
        if not Test.objects.filter(id=test_id).exists():
            return Response(
                {
                    "ok": False,
                    "error": "No test with the given id found",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        test = Test.objects.get(id=test_id)
        if test.author != email:  # If the user is not the author of the test
            return Response(
                {
                    "ok": False,
                    "error": "You are not the author of this test",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        result = Result.objects.filter(test_id=test_id)
        jsonresponse = {"ok": True, "result": []}
        for res in result:
            student_id = res.student_id
            name = UserProfile.objects.get(user_id=student_id).name
            jsonresponse["result"].append(
                {
                    "name": name,
                    "score": res.score,
                }
            )

        return Response(jsonresponse, status=status.HTTP_200_OK)
