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
from api.models import Test, UserProfile, Question, Result, Response as ResponseModel
from django.contrib.auth.models import User
import json
import datetime
from datetime import timedelta
import pytz

utc = pytz.UTC

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


class SubmitTestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data["data"]
            data = json.loads(data)
            test_id = data["test_id"]
            user_response = data["user_response"]
        except:
            # If test_id or answers are not provided
            jsonresponse = {
                "ok": False,
                "error": "test_id or user_response not provided",
            }
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
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
        for question in user_response:
            if not Question.objects.filter(id=question["id"]).exists():
                return Response(
                    {
                        "ok": False,
                        "error": "No question with the given id found",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            act_question = Question.objects.get(id=question["id"])
            if act_question.test_id != test:
                return Response(
                    {
                        "ok": False,
                        "error": "The question is not part of the test",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        student_id = request.user.id
        score = 0
        for question in user_response:
            question_id = question["id"]
            act_question = Question.objects.get(id=question_id)
            answerList = question["answerList"]
            options = act_question.options.split(",")
            try:
                answers = [options[i] for i in answerList]
            except:
                return Response(
                    {
                        "ok": False,
                        "error": "Invalid answerList",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            res = ",".join(answers)
            ResponseModel.objects.create(
                student_id=student_id,
                test_id=test,
                question_id=act_question,
                response=res,
            )
            if sorted(act_question.answer.split(",")) == sorted(answers):
                score += act_question.marks
        Result.objects.create(student_id=student_id, test_id=test, score=score)

        return Response(
            {
                "ok": True,
                "message": "Test submitted successfully",
                "score": score,
            },
            status=status.HTTP_200_OK,
        )


class clocksyncView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            test_id = request.data["test_id"]
        except:
            # If test_id or answers are not provided
            jsonresponse = {
                "ok": False,
                "error": "test_id or time not provided",
            }
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
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
        startTime = test.start
        duration = test.duration
        return Response(
            {
                "ok": True,
                "start_time": startTime,
                "duration": duration,
            },
            status=status.HTTP_200_OK,
        )


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        email = request.user.email
        user = User.objects.get(email=email)
        profile = UserProfile.objects.get(user_id=user)
        jsonresponse = {
            "ok": True,
            "name": profile.name,
            "bio": profile.bio,
            "profile_url": profile.profile_url,
            "upcomingtests": [],
            "pasttests": [],
        }
        tests = profile.tests.split(",")
        for test_id in tests:
            if test_id != "":
                test = Test.objects.get(id=test_id)
                if test.start.replace(tzinfo=utc) + timedelta(
                    seconds=test.duration
                ) > datetime.datetime.now().replace(tzinfo=utc):
                    jsonresponse["upcomingtests"].append(
                        {
                            "id": test.id,
                            "title": test.title,
                            "start": test.start,
                            "duration": test.duration,
                        }
                    )
                else:
                    jsonresponse["pasttests"].append(
                        {
                            "id": test.id,
                            "title": test.title,
                            "start": test.start,
                            "duration": test.duration,
                        }
                    )

        return Response(jsonresponse, status=status.HTTP_200_OK)
