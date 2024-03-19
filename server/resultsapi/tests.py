from django.test import TestCase

# Create your tests here.

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Test, UserProfile
import uuid
from datetime import datetime, timedelta
from django.utils import timezone


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
        mytest= Test.objects.create(
            id=uuid.uuid4(),
            title="past@test",
            start=timezone.now()-timedelta(seconds=4000),
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
