from django.test import TestCase, Client
from django.urls import reverse
import json

class TestCreateTest(TestCase):
    def setUp(self):
        # setting up and creation of a test institute
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "testinstitute@example.com",
            "password": "testpassword",
            "email": "testinstitute@example.com",
            "name": "test name institute",
            "type": "institute",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 201)

        # logging in
        self.login_url = reverse("login")
        login_data = {
            "username": "testinstitute@example.com",
            "password": "testpassword",
            "type": "institute",
        }
        self.response = self.client.post(self.login_url, login_data)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
        self.jwt_token = self.response.data["access"]

        create_test_data = {
            "title": "QUIZ",
            "start": "2024-03-24 21:11 +0000",
            "duration": "3600",
            "questions": json.dumps(
                [
                    {
                        "statement": "1+1 is what",
                        "type": "single",
                        "marks": 1,
                        "options": "a,b,c,d",
                        "answer": "a",
                        "id": 1,
                        "title": "",
                        "value": "",
                        "type": "single_correct",
                        "choices": [
                            {"value": "", "isCorrect": "false"},
                            {"value": "", "isCorrect": "false"},
                        ],
                        "answer": "",
                        "marks": "4",
                        "negative_marks": "",
                    }
                ]
            ),
        }
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        self.response = self.client.post(
            reverse("createTest"), create_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 201)
        self.assertTrue(self.response.data["ok"])
        self.assertTrue(self.response.data["test_id"])
        self.assertTrue(self.response.data["testCode"])
        self.test_id = self.response.data["test_id"]
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "teststudent@example.com",
            "password": "testpassword",
            "email": "teststudent@example.com",
            "name": "test name student",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 201)

        self.client = Client()
        self.signup_url = reverse("login")
        signup_data = {
            "username": "teststudent@example.com",
            "password": "testpassword",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
        self.jwt_token = self.response.data["access"]
        self.register_student_url = "/student/registerForTest/"
        register_student_data = {
            "test_id": self.test_id,
        }
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        self.response = self.client.post(
            self.register_student_url, register_student_data, **headers
        )
        # print(self.response.data)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])


    def test_start_test(self):
        self.start_test_url = reverse("startTest")
        start_test_data = {
            "test_id": self.test_id,
        }
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        self.response = self.client.post(
            self.start_test_url, start_test_data, **headers
        )

        # print(self.response.data)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
    
    def test_start_test_invalid(self):
        self.start_test_url = reverse("startTest")
        start_test_data = {
            "test_id": "123",
        }
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        self.response = self.client.post(
            self.start_test_url, start_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])
        self.assertEqual(self.response.data["message"], "Invalid Test ID")

    def test_start_test_invalid_student(self):
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "teststudent2@example.com",
            "password": "testpassword2",
            "email": "teststudent2@example.com",
            "name": "test name student",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 201)
        self.client = Client()
        self.signup_url = reverse("login")
        signup_data = {
            "username": "teststudent2@example.com",
            "password": "testpassword2",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
        self.jwt_token = self.response.data["access"]
        self.start_test_url = reverse("startTest")
        start_test_data = {
            "test_id": self.test_id,
        }
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        self.response = self.client.post(
            self.start_test_url, start_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 401)