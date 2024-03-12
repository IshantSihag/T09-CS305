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
from .models import Test, UserProfile, Question
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from django.utils.crypto import get_random_string


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


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            jsonresponse = {"ok": True, "message": "Successfully logged out"}
            return Response(jsonresponse, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            jsonresponse = {
                "ok": False,
                "error": "Invalid refresh token",
            }
            return Response(status=status.HTTP_400_BAD_REQUEST)


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
                return Response(response, status=status.HTTP_201_CREATED)
            else:
                response = {"ok": False, "error": "Invalid user type"}
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # print(str(e))
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
            duration = request.data["duration"]
            questions = request.data["questions"]
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
                question = Question.objects.create(
                    statement=question["statement"],
                    type=question["type"],
                    marks=question["marks"],
                    options=question["options"],
                    answer=question["answer"],
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
            return Response(jsonresponse, status=status.HTTP_201_CREATED)
        except Exception as e:
            jsonresponse = {
                "ok": False,
                "error": str(e),
            }
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)


class updateTest(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
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
                "error": "You are not authorized to update this test",
            }
            return Response(jsonresponse, status=status.HTTP_401_UNAUTHORIZED)

        test.title = request.data["title"]
        test.start = request.data["start"]
        test.duration = request.data["duration"]

        question_array = request.data["questions"]

        test = Test.objects.get(id=test_id)
        for question in question_array:
            if not Question.objects.filter(id=question["id"]).exists():
                question = Question.objects.create(
                    statement=question["statement"],
                    type=question["type"],
                    marks=question["marks"],
                    options=question["options"],
                    answer=question["answer"],
                    test_id=test,
                )
            else:
                question = Question.objects.get(id=question["id"])
                question.statement = question["statement"]
                question.type = question["type"]
                question.marks = question["marks"]
                question.options = question["options"]
                question.answer = question["answer"]
                question.save()

        question_ids = ""
        for question in question_array:
            question_ids += str(question["id"]) + ","
        question_ids = question_ids[:-1]
        test.questions = question_ids

        test.save()

        jsonresponse = {"ok": True, "message": "Test updated successfully"}
        return Response(jsonresponse, status=status.HTTP_200_OK)


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
