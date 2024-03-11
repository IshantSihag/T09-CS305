from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from api.models import Test, UserProfile
from django.contrib.auth.models import User
from rest_framework.decorators import api_view


# Create your views here.
class RegisterStudentForTestView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            student_email = request.data["username"]
            test_id = int(request.data["test_id"])
            test_code = request.data["test_code"]
        except:
            jsonresponse = {
                "ok": False,
                "error": "Invlaid Input format. required username , test_id, test_code",
            }
        try:
            jsonresponse = {"ok": False, "error": "error while registering try again"}
            try:
                print(student_email)
                user = User.objects.get(email=student_email)

            except User.DoesNotExist:
                jsonresponse["error"] = "No user with the given email or username"
                return Response(jsonresponse, status=status.HTTP_404_NOT_FOUND)
            userProfile = UserProfile.objects.get(user_id=user.id)
            if userProfile.type not in ("Student", "student"):
                jsonresponse["error"] = "user must be student"
                return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)

            try:
                test = Test.objects.get(id=test_id)
            except Test.DoesNotExist:
                jsonresponse["error"] = "Test not found"
                return Response(jsonresponse, status=status.HTTP_404_NOT_FOUND)
            registrations = test.registrations.split(",")
            registrations = [registration.strip() for registration in registrations]
            if str(user.id) in registrations:
                jsonresponse["error"] = "You are already registered for the Test"
                return Response(jsonresponse, status=status.HTTP_409_CONFLICT)

            if test_code != test.testCode:
                jsonresponse["error"] = "Incorrect Test code"
                return Response(jsonresponse, status=status.HTTP_406_NOT_ACCEPTABLE)

            # adding student_id to registrations for the test
            if len(test.registrations):
                test.registrations += ", " + str(user.id)
            else:
                test.registrations += str(user.id)
            test.save()

            # adding test_id to registrations for the student
            if len(userProfile.tests):
                userProfile.tests += ", " + str(test.id)
            else:
                userProfile.tests += str(test.id)
            userProfile.save()

            jsonresponse = {"ok": True, "message": "successfully registered"}

            return Response(jsonresponse, status=status.HTTP_200_OK)
        except Exception as e:
            jsonresponse = {
                "ok": False,
                "error": str(e),
            }
            return Response(jsonresponse,status.HTTP_500_INTERNAL_SERVER_ERROR)



class GetResultForStudent(APIView):
    permission_classes=(IsAuthenticated,)

    def get(self,request):
        #if the parameters are in the correct format
        try:
            student_email = request.GET.get('username')
            test_id=int(request.GET.get('test_id'))
        except:
            jsonresponse={
                "ok":False,
                "error":"Invlaid Input format. required username , test_id, test_code"
            }
        try:
            jsonresponse={
                "ok":False,
                "error" : "error while registering try again"
            }

            #if the email exists
            try:
                user = User.objects.get(email=student_email)
            except User.DoesNotExist:
                jsonresponse["error"] = "No user with the given email"
                return Response(jsonresponse, status=status.HTTP_404_NOT_FOUND)
            userProfile=UserProfile.objects.get(user_id=user.id)
            if(userProfile.type not in ('Student','student')):
                jsonresponse["error"] = "user must be student"
                return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
            
            #if there exists such test
            try:
                    test=Test.objects.get(id=test_id)
            except Test.DoesNotExist:
                    jsonresponse["error"] = "Test not found"
                    return Response(jsonresponse, status=status.HTTP_404_NOT_FOUND)
            
            #if student registered for the test
            registrations=test.registrations.split(",")
            registrations=[registration.strip() for registration in registrations]
            if(str(user.id) not in registrations):
                jsonresponse["error"]= "You were not registered for the Test"
                return Response(jsonresponse, status=status.HTTP_409_CONFLICT)
            
            #if student attempted the test
            #doubtful about my method to check if student attempted the test,
            #say student did attempt the test but didnt do any question
            try:
                studentResponse=ResponseModel.objects.get(student_id=userProfile.user_id,
                                                      test_id=test_id)
            except ResponseModel.DoesNotExist:
                jsonresponse["error"]= "Seems that you didn't attempted the test"
                Response(jsonresponse,status=status.HTTP_400_BAD_REQUEST)
            
            questions=test.questions.split(",")
            questions=[int(question.strip()) for question in questions]

            resultResponse={
                'ok':True,
                'total': 0,
                'score': 0,
            }
            score_student=0
            total_test=0
            questionwise_score=[]
            for question_id in questions:
                questionObject={}
                question=Question.objects.get(id=question_id,test_id=test.id)
                if(question == None):
                    raise Exception("question not Found")
                
                #update the total_score
                total_test+=int(question.marks)
                questionObject['id']=int(question.id)
                questionObject['statement']=question.statement
                questionObject['total_marks']=int(question.marks)
                questionObject['type']=question.type
                questionObject['marks_scored']=0 #placeholder updated later

                options=[option.strip() for option in 
                                    question.options.split(',')]
                    
                answer_options=[option.strip() for option in 
                                    question.answer.split(',')].sort()
                
                questionObject['options']=options
                #would it better to give indices of the options that are correct
                questionObject['answer_options_indices']=[options.index(option) for option in answer_options].sort()
                questionObject['attempted_options_indices']=[]

                student_response_question =studentResponse.get(question_id=question.id)
                #currently assumed that if student do not attempt a question then its 
                #response for that question won't be stored
                if student_response_question == None:
                    continue

                attempted_options =[option.strip() for option in 
                                    student_response_question.response.split(',')].sort()

                #would it better to give indices of the options that are correct
                questionObject['attempted_options_indices']=[options.index(option) for option in attempted_options].sort()
                question_score=0
                if(attempted_options==answer_options):
                    question_score=int(question.marks)

                questionObject['marks_scored']=question_score
                score_student+=question_score

                questionwise_score.append(questionObject) 

                if(question.type in ('single', 'Single Correct')):
                    pass       

            resultResponse["total"]=total_test
            resultResponse["score"]=score_student  
            resultResponse['questionwise_score']=questionwise_score

            return Response(resultResponse,status=status.HTTP_200_OK)    
                
        except Exception as e:
            jsonresponse={
                    "ok":False,
                    "error":e,
            }
            return(jsonresponse,status.HTTP_500_INTERNAL_SERVER_ERROR)
        
