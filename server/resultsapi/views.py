from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from api.models import Test, UserProfile, Question, Response as ResponseModel
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
import traceback
from datetime import timedelta
from django.utils import timezone
import uuid
from api.permissions import IsStudent
from datetime import datetime


# Create your views here.
class RegisterStudentForTestView(APIView):
    permission_classes = (IsAuthenticated, IsStudent)

    def post(self, request):
        try:
            student_email = request.user.username
            uuid.UUID(request.data["test_id"])
            test_id = request.data["test_id"]
        except:
            print(traceback.format_exc())
            jsonresponse = {
                "ok": False,
                "error": "Invlaid Input format. required test_id, test_code.",
            }
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
        try:
            jsonresponse = {"ok": False, "error": "error while registering try again"}
            try:
                user = User.objects.get(email=student_email)

            except User.DoesNotExist:
                print(traceback.format_exc())
                jsonresponse["error"] = "No user with the given email or username"
                return Response(jsonresponse, status=status.HTTP_404_NOT_FOUND)
            userProfile = UserProfile.objects.get(user_id=user.id)
            # if userProfile.type not in ("Student", "student"):
            #     jsonresponse["error"] = "user must be student"
            #     return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
            current_time = timezone.now()
            if current_time >= test.start:
                jsonresponse = {
                    "ok": False,
                    "error": "Registration is closed. The test has already started.",
                }
                return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)

            try:
                test = Test.objects.get(id=test_id)
            except Test.DoesNotExist:
                print(traceback.format_exc())
                jsonresponse["error"] = "Test not found"
                return Response(jsonresponse, status=status.HTTP_404_NOT_FOUND)
            registrations = test.registrations.split(",")
            registrations = [registration.strip() for registration in registrations]
            if str(user.email) in registrations:
                jsonresponse["error"] = "You are already registered for the Test"
                return Response(jsonresponse, status=status.HTTP_409_CONFLICT)

            # adding student_id to registrations for the test
            if len(test.registrations):
                test.registrations += "," + str(user.email)
            else:
                test.registrations += str(user.email)
            test.save()

            # adding test_id to registrations for the student
            if len(userProfile.tests):
                userProfile.tests += "," + str(test.id)
            else:
                userProfile.tests += str(test.id)
            userProfile.save()

            jsonresponse = {"ok": True, "message": "successfully registered"}

            return Response(jsonresponse, status=status.HTTP_200_OK)
        except Exception as e:
            print(traceback.format_exc())
            jsonresponse = {
                "ok": False,
                "error": str(e),
            }
            return Response(jsonresponse, status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetResultForStudent(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            uuid.UUID(request.GET.get("test_id"))
        except:
            return Response(
                {"ok": False, "error": "Invalid Input format."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            student_email = request.user.email
            test_id = request.GET.get("test_id")
            if not test_id:
                raise Exception
        except:
            print(traceback.format_exc())
            jsonresponse = {
                "ok": False,
                "error": "Invalid Input format.",
            }
            return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
        try:
            jsonresponse = {"ok": False, "error": "error while registering try again"}

            # if the email exists
            try:
                user = User.objects.get(email=student_email)
            except User.DoesNotExist:
                print(traceback.format_exc())
                jsonresponse["error"] = "No user with the given email"
                return Response(jsonresponse, status=status.HTTP_404_NOT_FOUND)
            userProfile = UserProfile.objects.get(user_id=user.id)
            if userProfile.type not in ("Student", "student"):
                jsonresponse["error"] = "user must be student"
                return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)

            # if there exists such test
            try:
                test = Test.objects.get(id=test_id)
            except Test.DoesNotExist:
                print(traceback.format_exc())
                jsonresponse["error"] = "Test not found"
                return Response(jsonresponse, status=status.HTTP_404_NOT_FOUND)

            # if student registered for the test
            registrations = test.registrations.split(",")
            registrations = [registration.strip() for registration in registrations]
            if str(user.email) not in registrations:
                jsonresponse["error"] = "You were not registered for the Test"
                return Response(jsonresponse, status=status.HTTP_409_CONFLICT)

            # ongoing test
            start = test.start
            end = start + timedelta(seconds=test.duration)
            if timezone.now() <= start:
                jsonresponse["error"] = "The test has not yet started"
                return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
            elif end >= timezone.now():
                jsonresponse["error"] = "The test is still ongoing"
                return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)

            # if student attempted the test
            # doubtful about my method to check if student attempted the test,
            # say student did attempt the test but didnt do any question

            try:

                studentResponse = ResponseModel.objects.filter(
                    student_id=user.id, test_id=test_id
                )
            except ResponseModel.DoesNotExist:
                print(traceback.format_exc())
                # jsonresponse["error"]= "Seems that you didn't attempted the test"
                # return Response(jsonresponse,status=status.HTTP_400_BAD_REQUEST)
                # for Now I'm not testing if student attempted the test or not
                pass
            # print(studentResponse)

            test_questions = (
                test.questions.strip()
            )  # Remove leading and trailing whitespace
            test_questions = (
                test.questions.strip()
            )  # Remove leading and trailing whitespace

            if test_questions:  # Check if the string is not empty
                questions = [
                    int(question.strip()) for question in test_questions.split(",")
                ]
            else:
                questions = []  # Assign an empty list or any other default value

            resultResponse = {
                "ok": True,
                "total": 0,
                "score": 0,
            }
            score_student = 0
            total_test = 0
            questionwise_score = []

            for question_id in questions:
                questionObject = {}
                try:
                    question = Question.objects.get(id=question_id, test_id=test.id)
                except Question.DoesNotExist:
                    print(traceback.format_exc())
                    raise Exception("question not Found")
                    print(traceback.format_exc())

                # update the total_score
                total_test += int(question.marks)
                questionObject["id"] = int(question.id)
                questionObject["statement"] = question.statement
                questionObject["total_marks"] = int(question.marks)
                questionObject["type"] = question.type
                questionObject["marks_scored"] = 0  # placeholder updated later

                options = [option.strip() for option in question.options.split(",")]

                answer_options = [
                    option.strip() for option in question.answer.split(",")
                ]
                answer_options.sort()
                questionObject["options"] = options
                # would it better to give indices of the options that are correct
                questionObject["answer_options_indices"] = [
                    options.index(option) for option in answer_options
                ]
                questionObject["answer_options_indices"].sort()
                questionObject["attempted_options_indices"] = (
                    []
                )  # just a placeholder updated later

                try:
                    student_response_question = studentResponse.get(
                        question_id=question.id
                    )
                # currently assumed that if student do not attempt a question then its
                # response for that que stion won't be stored

                except ResponseModel.DoesNotExist:
                    print(traceback.format_exc())
                    questionwise_score.append(questionObject)
                    continue

                attempted_options = [
                    option.strip()
                    for option in student_response_question.response.split(",")
                ]
                attempted_options.sort()

                # would it better to give indices of the options that are correct
                questionObject["attempted_options_indices"] = [
                    options.index(option) for option in attempted_options
                ]
                questionObject["attempted_options_indices"].sort()
                question_score = 0
                if attempted_options == answer_options:
                    question_score = int(question.marks)

                questionObject["marks_scored"] = question_score
                score_student += question_score

                questionwise_score.append(questionObject)

                if question.type in ("single", "Single Correct"):
                    pass

            resultResponse["total"] = total_test
            resultResponse["score"] = score_student
            resultResponse["questionwise_score"] = questionwise_score

            return Response(resultResponse, status=status.HTTP_200_OK)

        except Exception as e:
            print(traceback.format_exc())
            jsonresponse = {
                "ok": False,
                "error": str(e),
            }
            return Response(jsonresponse, status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetTestID(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            try:
                test_code = request.GET.get("test_code")
                if not test_code:
                    raise Exception
            except:
                print(traceback.format_exc())
                jsonresponse = {
                    "ok": False,
                    "error": "Invlaid Input format. Required test_code",
                }
                return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
            try:
                test = Test.objects.get(testCode=test_code)
                jsonresponse = {
                    "ok": True,
                    "test_id": test.id,
                }
                return Response(jsonresponse, status=status.HTTP_200_OK)
            except Test.DoesNotExist:
                print(traceback.format_exc())
                jsonresponse = {
                    "ok": False,
                    "error": "Test not found",
                }
                return Response(jsonresponse, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(traceback.format_exc())
            print(e)
            jsonresponse = {"ok": False, "error": "Error while processing the api"}
            return Response(jsonresponse, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
