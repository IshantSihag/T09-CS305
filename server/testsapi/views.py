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
from api.models import (
    Test,
    UserProfile,
    Question,
    Result,
    Response as ResponseModel,
    Student,
)
from django.contrib.auth.models import User
import json
import datetime
from datetime import timedelta
import pytz
import uuid

utc = pytz.UTC

# Create your views here.


# Gives the Result view for Institution
class TestResultView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        email = request.user.email
        try:
            # to get the test_id from the request url
            uuid.UUID(request.GET.get("test_id"))
            test_id = request.GET.get("test_id")
        except:
            # If test_id is not provided
            return Response(
                {
                    "ok": False,
                    "error": "test_id not provided or invalid",
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

            userProfile = UserProfile.objects.get(user_id=student_id)
            name = userProfile.name
            try:
                student = Student.objects.get(student_id=student_id)
            except Student.DoesNotExist:
                pass
            jsonresponse["result"].append(
                {
                    "name": name,
                    "cgpa": student.cgpa,
                    "phoneNo": student.phone_number,
                    "batch": student.batch,
                    "course": student.course,
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
            uuid.UUID(data["test_id"])
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
        if request.user.email not in test.registrations.split(","):
            return Response(
                {
                    "ok": False,
                    "error": "You are not registered for this test",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        startTime = test.start
        duration = test.duration
        endTime = startTime + timedelta(seconds=duration + 5)
        
        if datetime.datetime.now().replace(tzinfo=utc) < startTime:
            return Response(
                {
                    "ok": False,
                    "error": "Test has not started yet",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if datetime.datetime.now().replace(tzinfo=utc) > endTime:
            return Response(
                {
                    "ok": False,
                    "error": "Test has ended",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if Result.objects.filter(student_id=request.user.id, test_id=test).exists():
            return Response(
                {
                    "ok": False,
                    "error": "You have already submitted the test",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
            
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
            },
            status=status.HTTP_200_OK,
        )


class clocksyncView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            uuid.UUID(request.data["test_id"])
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
                            "testCode": test.testCode,
                        }
                    )
                else:
                    jsonresponse["pasttests"].append(
                        {
                            "id": test.id,
                            "title": test.title,
                            "start": test.start,
                            "duration": test.duration,
                            "testCode": test.testCode,
                        }
                    )

        return Response(jsonresponse, status=status.HTTP_200_OK)


class getTestDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
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
        numofquestions = 0
        marks = 0
        date = test.start.date()
        time = test.start.time()
        questions = test.questions.split(",")
        for questionid in questions:
            question = Question.objects.get(id=questionid)
            marks += question.marks
            numofquestions += 1

        jsonresponse = {
            "ok": True,
            "title": test.title,
            "duration": test.duration,
            "date": date,
            "time": time,
            "marks": marks,
            "questions": numofquestions,
        }

        return Response(jsonresponse, status=status.HTTP_200_OK)
