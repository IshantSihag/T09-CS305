from django.test import TestCase

import json
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Test, UserProfile, Response as ResponseModel, Question, Result
from django.utils import timezone
import uuid
from datetime import datetime, timedelta
from django.urls import reverse
from rest_framework import status


class TestGetResultForStudentAPI(APITestCase):
    def setUp(self):

        test_id = uuid.uuid4()
        self.test = Test.objects.create(
            id=test_id,
            title="Sample Test",
            start=timezone.now() - timedelta(seconds=4000),
            duration=3600,  # 1 hour
            author="author@example.com",
            testCode="TEST123",
        )

        # Questions
        self.question1 = Question.objects.create(
            statement="Question 1?",
            type="single",
            marks=5,
            options="Option A, Option B, Option C, Option D",
            answer="Option A",
            test_id=self.test,
        )

        self.question2 = Question.objects.create(
            statement="Question 2?",
            type="single",
            marks=3,
            options="Option A, Option B, Option C, Option D",
            answer="Option B",
            test_id=self.test,
        )

        self.question3 = Question.objects.create(
            statement="Question 3?",
            type="multiple",
            marks=5,
            options="Option A, Option B, Option C, Option D",
            answer="Option A, Option B",
            test_id=self.test,
        )

        self.test.questions += (
            f"{self.question1.id},{self.question2.id},{self.question3.id}"
        )

        self.user = User.objects.create_user(
            username="testuser@example.com",
            email="testuser@example.com",
            password="testpassword",
        )
        self.userprofile = UserProfile.objects.create(
            user_id=self.user, name="Test User", type="student"
        )

        self.response1 = ResponseModel.objects.create(
            student_id=self.user.id,
            test_id=self.test,
            question_id=self.question1,
            response="Option A",
            timestamp=timezone.now() - timedelta(seconds=3900),
        )

        self.response2 = ResponseModel.objects.create(
            student_id=self.user.id,
            test_id=self.test,
            question_id=self.question2,
            response="Option A",  # Incorrect response
            timestamp=timezone.now() - timedelta(seconds=3500),
        )

        self.response3 = ResponseModel.objects.create(
            student_id=self.user.id,
            test_id=self.test,
            question_id=self.question3,
            response="Option A, Option B, Option D",  # Incorrect response
            timestamp=timezone.now() - timedelta(seconds=2000),
        )

        # final score of the student
        score = 5 + 0 + 0  # assumptions based on above setup data
        self.result = Result.objects.create(
            student_id=self.user.id, test_id=self.test, score=score
        )

        # registering the student
        # adding student_id to registrations for the test
        if len(self.test.registrations):
            self.test.registrations += "," + str(self.user.email)
        else:
            self.test.registrations += str(self.user.email)
        self.test.save()

        # adding test_id to registrations for the student
        if len(self.userprofile.tests):
            self.userprofile.tests += "," + str(self.test.id)
        else:
            self.userprofile.tests += str(self.test.id)
        self.userprofile.save()

        self.url = reverse("GetResultForStudent")

    def test_successful_request(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url, {"test_id": self.test.id})
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertTrue(result["ok"])
        self.assertEqual(result["total"], 13)
        self.assertEqual(result["score"], 5)
        self.assertEqual(len(result["questionwise_score"]), 3)

    def test_invalid_input_format(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)
        result = response.json()
        self.assertFalse(result["ok"])
        self.assertIn("Invalid Input format", result["error"])

    def test_non_student_user(self):
        # Creating a non-student user for testing
        non_student_user = User.objects.create_user(
            username="nonstudent@example.com",
            email="nonstudent@example.com",
            password="testpassword",
        )
        non_student_userprofile = UserProfile.objects.create(
            user_id=non_student_user, name="Non-Student User", type="institute"
        )
        self.client.force_authenticate(user=non_student_user)
        response = self.client.get(self.url, {"test_id": self.test.id})
        self.assertEqual(response.status_code, 400)
        result = response.json()
        self.assertFalse(result["ok"])
        self.assertIn("user must be student", result["error"])

    def test_result_before_end_of_test(self):
        onGoingTest = Test.objects.create(
            id=uuid.uuid4(),
            title="Sample Test",
            start=timezone.now(),
            duration=3600,  # 1 hour
            author="author@example.com",
            testCode="TEST@2",
            registrations=f"{self.user.email}",
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url, {"test_id": onGoingTest.id})
        print(response.json())

        self.assertEqual(response.status_code, 400)
        result = response.json()
        self.assertFalse(result["ok"])
        self.assertIn("The test is still ongoing", result["error"])

    def test_student_not_registered(self):
        myuser = User.objects.create_user(
            username="myuser@example.com",
            email="myuser@example.com",
            password="mypassword",
        )
        myuserprofile = UserProfile.objects.create(
            user_id=myuser, name="Test User", type="student"
        )
        self.client.force_authenticate(user=myuser)

        response = self.client.get(self.url, {"test_id": self.test.id})
        print(response.json())

        self.assertEqual(response.status_code, 409)
        result = response.json()
        self.assertFalse(result["ok"])
        self.assertIn("You were not registered for the Test", result["error"])

    def test_test_not_found(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.url, {"test_id": uuid.uuid4()})
        print(response.json())

        self.assertEqual(response.status_code, 404)
        result = response.json()
        self.assertFalse(result["ok"])
        self.assertIn("Test not found", result["error"])




class RegisterStudentForTestViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="test@example.com",
            email="test@example.com",
            password="testpassword",
        )
        self.student_profile = UserProfile.objects.create(
            user_id=self.user, type="student"
        )
        self.test = Test.objects.create(
            id=uuid.uuid4(),
            title="test@test",
            start=timezone.now(),
            duration=3600,
            author="institute@example.com",
            testCode="UUYREW",
        )
        self.url = reverse("RegisterStudentForTest")

    def test_successful_registration(self):
        data = {"test_id": self.test.id}
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["ok"], True)
        self.assertEqual(response.data["message"], "successfully registered")

    def test_invalid_input_format(self):
        invalid_data = {}  # No test_id provided
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["ok"], False)
        self.assertIn("error", response.data)

    def test_user_not_student(self):
        # Creating a non-student user
        non_student_user = User.objects.create_user(
            username="nonstudent@example.com",
            email="nonstudent@example.com",
            password="testpassword",
        )
        UserProfile.objects.create(user_id=non_student_user, type="institute")
        data = {"test_id": self.test.id}
        self.client.force_authenticate(user=non_student_user)
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["ok"], False)
        self.assertIn("user must be student", response.data["error"])

    def test_user_already_registered(self):
        # registering for the test
        data = {"test_id": self.test.id}
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, data)

        # registering second time for the same test
        data = {"test_id": self.test.id}
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data["ok"], False)
        self.assertIn("You are already registered for the Test", response.data["error"])

    def test_no_test_found(self):
        data = {"test_id": uuid.uuid4()}
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["ok"], False)
        self.assertIn("Test not found", response.data["error"])

    def test_test_ended(self):
        mytest = Test.objects.create(
            id=uuid.uuid4(),
            title="past@test",
            start=timezone.now() - timedelta(seconds=4000),
            duration=3600,
            author="institute@example.com",
            testCode="UUYREQ",
        )
        data = {"test_id": mytest.id}
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["ok"], False)
        self.assertEqual(response.data["error"], "Test already ended")
