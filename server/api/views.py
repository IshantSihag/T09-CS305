from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    SignUpViewSerializer,
    MyTokenObtainPairSerializer,
    ProfileViewSerializer,
    UserProfileSerializer,
)
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Test, UserProfile, Question, Student
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from django.utils.crypto import get_random_string
import json
import uuid


class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            if serializer.is_valid():
                email = request.data["username"]
                type = request.data["type"]
                user = User.objects.get(email=email)
                user_profile = UserProfile.objects.get(user_id=user.id, type=type)
                user_profile_serializer = UserProfileSerializer(user_profile)
                user_profile_serializer = user_profile_serializer.data
                tests = user_profile_serializer["tests"]
                jsonresponse = {
                    "ok": True,
                    "access": serializer.validated_data["access"],
                    "refresh": serializer.validated_data["refresh"],
                    "type": user_profile_serializer["type"],
                    "name": user_profile_serializer["name"],
                    "email": user.email,
                    "profile_url": user_profile_serializer["profile_url"],
                    "bio": user_profile_serializer["bio"],
                    "expires_in": 3600,
                }
                return Response(jsonresponse, status=status.HTTP_200_OK)
            else:
                jsonresponse = {"ok": False, "error": "Invalid input"}
                return Response(jsonresponse, status=status.HTTP_401_UNAUTHORIZED)
        except:
            jsonresponse = {"ok": False, "error": "Invalid email or password"}
            return Response(jsonresponse, status=status.HTTP_401_UNAUTHORIZED)


class HomeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {
            "message": "Welcome to the JWT Authentication page using React Js and Django!"
        }
        return Response(content)


class SignUpView(APIView):
    def post(self, request):
        try:
            if User.objects.filter(email=request.data["username"]).exists():
                return Response(
                    {"ok": False, "error": "Email already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if (
                request.data["type"] != "student"
                and request.data["type"] != "institute"
            ):
                return Response(
                    {"ok": False, "error": "Invalid user type"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            serializer = SignUpViewSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                user = User.objects.get(email=request.data["username"])

                user_profile = UserProfile.objects.get(user_id=user.id)
                user_profile.name = request.data["name"]
                user_profile.type = request.data["type"]
                user_profile.save()
                response = {
                    "ok": True,
                    "type": user_profile.type,
                    "name": user_profile.name,
                    "email": serializer.data["email"],
                    "bio": "",
                    "profile_url": "",
                }
                if request.data["type"] == "student":
                    Student.objects.create(
                        student_id=user.id,
                        phone_number="",
                        cgpa=0.0,
                        batch=0,
                        course="",
                    )

                return Response(response, status=status.HTTP_201_CREATED)
            else:
                response = {"ok": False, "error": "Invalid user type"}
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            response = {"ok": False, "error": "Invalid input"}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class getTest(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            username = request.user.email
            tests = Test.objects.filter(author=username)
            jsonresponse = {
                "ok": True,
                "tests": [],
            }
            for test in tests:
                jsonresponse["tests"].append(
                    {
                        "id": test.id,
                        "title": test.title,
                        "start": test.start,
                        "duration": test.duration,
                        "author": test.author,
                        "code": test.testCode,
                    }
                )
            return Response(jsonresponse, status=status.HTTP_200_OK)
        except:
            jsonresponse = {"ok": False, "error": "Test not found"}
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            username = request.user.email
            # print(username)
            user = User.objects.get(username=username)
            # print(user.email)
            # userProfile=UserProfile.objects.get(user=user)
            serialiser = ProfileViewSerializer(user, many=False)
            # print(serialiser.data)
            if serialiser.data["userdetails"]["type"] == "student":
                return Response(serialiser.data, status=status.HTTP_200_OK)
            elif serialiser.data["userdetails"]["type"] == "institute":
                return Response(serialiser.data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # print(str(e))
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class startTest(APIView):
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
        registrations = test.registrations.split(",")
        if user_email in registrations:
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
                "error": "You are not registered for this test",
            }
            return Response(jsonresponse, status=status.HTTP_401_UNAUTHORIZED)


class deleteTest(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            uuid.UUID(request.data["test_id"])
            test_id = request.data["test_id"]
        except:
            jsonresponse = {"ok": False, "error": "Invalid input. test_id required"}
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
        user_email = request.user.email
        if not Test.objects.filter(id=test_id).exists():
            jsonresponse = {"ok": False, "error": "Test not found"}
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
        test = Test.objects.get(id=test_id)
        if test.author != user_email:
            jsonresponse = {
                "ok": False,
                "error": "You are not authorized to delete this test",
            }
            return Response(jsonresponse, status=status.HTTP_401_UNAUTHORIZED)
        test.delete()
        jsonresponse = {"ok": True, "message": "Test deleted successfully"}
        return Response(jsonresponse, status=status.HTTP_200_OK)


class createTest(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            title = request.data["title"]
            start = request.data["start"]
            duration = int(request.data["duration"])
            if duration < 0:
                jsonresponse = {"ok": False, "error": "Invalid duration"}
                return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
            questions = request.data["questions"]
            questions = json.loads(questions)
            for question in questions:
                if question["type"].split("_")[0] not in (
                    "single",
                    "multiple",
                ):
                    jsonresponse = {"ok": False, "error": "Invalid question type"}
                    return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
                if int(question["marks"]) < 0:
                    jsonresponse = {"ok": False, "error": "Invalid marks"}
                    return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
        except:
            jsonresponse = {"ok": False, "error": "Invalid input"}
        try:
            user_email = request.user.email
            test = Test.objects.create(
                title=title,
                start=start,
                duration=duration,
                author=user_email,
                questions="",
                testCode="",
                registrations="",
            )
            question_ids = ""
            for question in questions:
                answer = ""
                options = ""
                for choice in question["choices"]:
                    if options == "":
                        options += choice["value"]
                    else:
                        options += "," + choice["value"]
                    if choice["isCorrect"] == True:
                        if answer == "":
                            answer += choice["value"]
                        else:
                            answer += "," + choice["value"]

                question = Question.objects.create(
                    statement=question["statement"],
                    type=question["type"].split("_")[0],
                    marks=question["marks"],
                    options=options,
                    answer=answer,
                    test_id=test,
                )
            question_ids += str(question.id) + ","
            question_ids = question_ids[:-1]
            test.questions = question_ids
            test.save()
            testCode = get_random_string(
                8, allowed_chars="1234567890abcdefghijklmnopqrstuvwxyz"
            )
            test.testCode = testCode
            test.save()
            jsonresponse = {
                "ok": True,
                "message": "Test created successfully",
                "test_id": test.id,
                "testCode": testCode,
            }

            profile = UserProfile.objects.get(user_id=request.user)
            if profile.tests == "":
                profile.tests = str(test.id)
            else:
                profile.tests += "," + str(test.id)

            profile.save()
            return Response(jsonresponse, status=status.HTTP_201_CREATED)
        except Exception as e:
            jsonresponse = {
                "ok": False,
                "error": str(e),
            }
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)


class UpdateTest(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            email = request.user.email
            title = request.data["title"]
            start = request.data["start"]
            duration = request.data["duration"]
            questions = request.data["questions"]
            questions = json.loads(questions)
            uuid.UUID(request.data["test_id"])
            id = request.data["test_id"]
        except Exception as e:
            print(str(e))
            jsonresponse = {
                "ok": False,
                "error": "body of the request not as intended",
            }
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
        try:
            test = Test.objects.get(id=id)
        except Test.DoesNotExist:
            jsonresponse = {
                "ok": False,
                "error": "Test not found",
            }
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
        try:
            userprofile = UserProfile.objects.get(user_id=request.user)
        except Exception as e:
            print(str(e))
            jsonresponse = {
                "ok": False,
                "error": "You are not a valid User",
            }
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
        if userprofile.type != "institute":
            jsonresponse = {
                "ok": False,
                "error": "Only insitute profile allowed access this resource",
            }
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
        if test.author != request.user.email:
            jsonresponse = {
                "ok": False,
                "error": "You do not have access to update",
            }
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)

        try:
            test.title = title
            test.start = start
            test.duration = duration
            question_ids = ""
            for question in questions:
                answer = ""
                options = ""
                for choice in question["choices"]:
                    if options == "":
                        options += choice["value"]
                    else:
                        options += "," + choice["value"]
                    if choice["isCorrect"] == True:
                        if answer == "":
                            answer += choice["value"]
                        else:
                            answer += "," + choice["value"]

                # check if question already exsists
                if Question.objects.filter(id=question["id"]).exists():
                    question_inst = Question.objects.get(id=question["id"])
                    question_inst.statement = question["statement"]
                    question_inst.type = question["type"]
                    question_inst.marks = question["marks"]
                    question_inst.options = options
                    question_inst.answer = answer
                    question_inst.save()
                else:
                    question_inst = Question.objects.create(
                        statement=question["statement"],
                        type=question["type"].split("_")[0],
                        marks=question["marks"],
                        options=options,
                        answer=answer,
                        test_id=test,
                    )

                question_ids += str(question_inst.id) + ","

            question_ids = question_ids[:-1]
            test.questions = question_ids
            test.save()
            jsonresponse = {
                "ok": True,
                "message": "Test updated successfully",
                "test_id": test.id,
            }
            return Response(jsonresponse, status=status.HTTP_200_OK)
        except Exception as e:
            jsonresponse = {
                "ok": False,
                "error": str(e),
            }
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)


class GetAllTestStudentView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        jsonresponse = {
            "ok": False,
            "error": "backend error",
        }
        try:
            try:
                user = User.objects.get(email=request.user.email)
            except User.DoesNotExist:
                jsonresponse["error"] = "No user with the given email"
                return Response(jsonresponse, status=status.HTTP_404_NOT_FOUND)
            userProfile = UserProfile.objects.get(user_id=user.id)
            if userProfile.type not in ("Student", "student"):
                jsonresponse["error"] = "user must be student"
                return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
            jsonresponse = {
                "ok": True,
                "tests": userProfile.tests.split(","),
            }
            return Response(jsonresponse, status=status.HTTP_200_OK)
        except Exception as e:
            jsonresponse = {
                "ok": False,
                "error": str(e),
            }
            return (jsonresponse, status.HTTP_500_INTERNAL_SERVER_ERROR)
