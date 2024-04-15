from django.test import TestCase, Client
from django.urls import reverse
from datetime import datetime
import json


class TestResultInstitute(TestCase):
    def setUp(self):

        # Basic urls and client set up
        self.client = Client()
        self.signup_url = reverse("signup")
        self.login_url = reverse("login")
        self.register_url = "/student/registerForTest/"

        # signing up a student
        signup_data = {
            "username": "teststudent@example.com",
            "password": "testpassword",
            "email": "teststudent@example.com",
            "name": "test name student",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 201)

        # signing up an institute
        self.client = Client()
        signup_data = {
            "username": "testinstitute@example.com",
            "password": "testpassword",
            "email": "testinstitute@example.com",
            "name": "test name institute",
            "type": "institute",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 201)

        # logging in institute for creation of test
        login_data = {
            "username": "testinstitute@example.com",
            "password": "testpassword",
            "type": "institute",
        }
        self.response = self.client.post(self.login_url, login_data)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
        self.jwt_token_institute = self.response.data["access"]

        # creating a test
        create_test_data = {
            "title": "QUIZ",
            "start": f'{datetime.now().strftime("%Y-%m-%d %H:%M:%S")} +0000',
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
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token_institute}
        self.response = self.client.post(
            reverse("createTest"), create_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 201)
        self.assertTrue(self.response.data["ok"])
        self.assertTrue(self.response.data["test_id"])
        self.test_id = self.response.data["test_id"]
        self.assertTrue(self.response.data["testCode"])

        # logging in student for registration of test
        login_data = {
            "username": "teststudent@example.com",
            "password": "testpassword",
            "type": "student",
        }
        self.response = self.client.post(self.login_url, login_data)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
        self.jwt_token = self.response.data["access"]

        # student registring for the test
        register_data = {
            "test_id": self.test_id,
        }
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        self.response = self.client.post(self.register_url, register_data, **headers)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
        submit_test_data = {
            "data": json.dumps(
                {
                    "test_id": str(self.test_id),
                    "user_response": [
                        {
                            "id": 1,
                            "answerList": [0],
                        }
                    ],
                }
            ),
        }
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        self.response = self.client.post(
            reverse("submitTest"), submit_test_data, **headers
        )
        # print(self.response.data)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
        self.assertTrue(self.response.data["message"])
        self.assertTrue(self.response.data["score"])

    def test_result_institute(self):
        self.result_url = reverse("testresult")
        headers = {
            "HTTP_AUTHORIZATION": "Bearer " + self.jwt_token_institute,
        }
        self.result_url += f"?test_id={self.test_id}"
        self.response = self.client.get(self.result_url, format=json, **headers)
        # print(self.response.data)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
        self.assertTrue(self.response.data["result"])
        self.assertTrue(self.response.data["result"][0]["score"])
        self.assertTrue(self.response.data["result"][0]["name"])

    def test_result_no_test_id(self):
        self.result_url = reverse("testresult")
        headers = {
            "HTTP_AUTHORIZATION": "Bearer " + self.jwt_token_institute,
        }
        self.response = self.client.get(self.result_url, format=json, **headers)
        # print(self.response.data)
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])

    def test_result_no_auth(self):
        self.result_url = reverse("testresult")
        self.response = self.client.get(self.result_url)
        self.assertEqual(self.response.status_code, 401)

    def test_result_not_author(self):
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "testinstitute2@example.com",
            "password": "testpassword2",
            "email": "testinstitute2@example.com",
            "name": "test name institute",
            "type": "institute",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 201)

        # logging in
        self.login_url = reverse("login")
        login_data = {
            "username": "testinstitute2@example.com",
            "password": "testpassword2",
            "type": "institute",
        }
        self.response = self.client.post(self.login_url, login_data)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
        self.jwt_token = self.response.data["access"]
        self.result_url = reverse("testresult")
        headers = {
            "HTTP_AUTHORIZATION": "Bearer " + self.jwt_token,
        }
        self.result_url += f"?test_id={self.test_id}"
        self.response = self.client.get(self.result_url, format=json, **headers)
        self.assertEqual(self.response.status_code, 401)
        self.assertFalse(self.response.data["ok"])
        self.assertTrue(self.response.data["error"])

    def pending_test_result_invalid_test_id(self):
        self.result_url = reverse("testresult")
        headers = {
            "HTTP_AUTHORIZATION": "Bearer " + self.jwt_token_institute,
        }
        self.result_url += f"?test_id=0"
        self.response = self.client.get(self.result_url, format=json, **headers)
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])
