from django.test import TestCase, Client
from django.urls import reverse
import json
import uuid


class TestCreateTest(TestCase):
    def setUp(self):
        # setting up and creation of a test student
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
        self.test_id = self.response.data["test_id"]
        self.assertEqual(self.response.status_code, 201)
        self.assertTrue(self.response.data["ok"])
        self.assertTrue(self.response.data["test_id"])
        self.assertTrue(self.response.data["testCode"])

    def test_delete_test(self):
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        delete_test_data = {"test_id": self.test_id}
        self.response = self.client.post(
            reverse("deleteTest"), delete_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
        self.assertEqual(self.response.data["message"], "Test deleted successfully")

    def test_delete_test_unauthorized_access(self):
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        delete_test_data = {"test_id": self.test_id}
        self.response = self.client.post(reverse("deleteTest"), delete_test_data)
        self.assertEqual(self.response.status_code, 401)

    def test_delete_test_invalid_jwt_token(self):
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token + "invalid"}
        delete_test_data = {"test_id": self.test_id}
        self.response = self.client.post(
            reverse("deleteTest"), delete_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 401)

    def test_delete_different_user(self):
        # setting up and creation of a test student
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "different",
            "password": "testpassword",
            "email": "different@mail.com",
            "name": "test name institute",
            "type": "institute",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 201)

        # logging in
        self.login_url = reverse("login")
        login_data = {
            "username": "different",
            "password": "testpassword",
            "type": "institute",
        }
        self.response = self.client.post(self.login_url, login_data)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
        self.jwt_token = self.response.data["access"]
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        delete_test_data = {"test_id": self.test_id}
        self.response = self.client.post(
            reverse("deleteTest"), delete_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 401)
        self.assertFalse(self.response.data["ok"])

    def test_bad_data(self):
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        delete_test_data = {"invalid": "invalid"}
        self.response = self.client.post(
            reverse("deleteTest"), delete_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])

    def test_bad_test_id(self):
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        delete_test_data = {"test_id": uuid.uuid4()}
        self.response = self.client.post(
            reverse("deleteTest"), delete_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])

    def pending_test_delete_test_invalid_test_id(self):
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        delete_test_data = {"test_id": "invalid_test_id"}
        self.response = self.client.post(
            reverse("deleteTest"), delete_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])
        self.assertEqual(self.response.data["message"], "Invalid test_id")
