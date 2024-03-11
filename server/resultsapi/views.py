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
    permission_classes=(IsAuthenticated,)
    def post(self,request):
        try:
            student_email = request.data['username']
            test_id=int(request.data['test_id'])
            test_code=request.data["test_code"]
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
            try:
                print(student_email)
                user = User.objects.get(email=student_email)
                
            except User.DoesNotExist:
                jsonresponse["error"] = "No user with the given email or username"
                return Response(jsonresponse, status=status.HTTP_404_NOT_FOUND)
            userProfile=UserProfile.objects.get(user_id=user.id)
            if(userProfile.type not in ('Student','student')):
                jsonresponse["error"] = "user must be student"
                return Response(jsonresponse, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                    test=Test.objects.get(id=test_id)
            except Test.DoesNotExist:
                    jsonresponse["error"] = "Test not found"
                    return Response(jsonresponse, status=status.HTTP_404_NOT_FOUND)
            registrations=test.registrations.split(",")
            registrations=[registration.strip() for registration in registrations]
            if(str(user.id) in registrations):
                jsonresponse["error"]= "You are already registered for the Test"
                return Response(jsonresponse, status=status.HTTP_409_CONFLICT)
            
            if(test_code != test.testCode):
                jsonresponse["error"]= "Incorrect Test code"
                return Response(jsonresponse, status=status.HTTP_406_NOT_ACCEPTABLE)
            
            #adding student_id to registrations for the test
            if(len(test.registrations)):
                test.registrations+=(", " + str(user.id))
            else:
                test.registrations+=(str(user.id))
            test.save()

            #adding test_id to registrations for the student
            if(len(userProfile.tests)):
                userProfile.tests+=(", " + str(test.id))
            else:
                userProfile.tests+=(str(test.id))
            userProfile.save()

            jsonresponse={'ok':True,
                         'message':'successfully registered'
                    }
            
            return Response(jsonresponse,status=status.HTTP_200_OK)
        except Exception as e:
            jsonresponse={
                    "ok":False,
                    "error":str(e),
            }
            return Response(jsonresponse,status.HTTP_500_INTERNAL_SERVER_ERROR)
