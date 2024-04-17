from django.test import TestCase, Client
from django.urls import reverse
from datetime import datetime
import json


class TestCreateTest(TestCase):
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

    def test_submit_test(self):
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
        # self.assertTrue(self.response.data["score"])

    def test_submit_test_invalid_test_id(self):
        submit_test_data = {
            "data": json.dumps(
                {
                    "test_id": str(self.test_id),
                    "user_response": [
                        {
                            "id": 2,
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
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])
        self.assertTrue(self.response.data["error"])

    def test_submit_test_invalid_answerList(self):
        submit_test_data = {
            "data": json.dumps(
                {
                    "test_id": str(self.test_id),
                    "user_response": [
                        {
                            "id": 1,
                            "answerList": [4],
                        }
                    ],
                }
            ),
        }
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        self.response = self.client.post(
            reverse("submitTest"), submit_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])
        self.assertTrue(self.response.data["error"])

    def test_submit_test_no_auth(self):
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
        headers = {}
        self.response = self.client.post(
            reverse("submitTest"), submit_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 401)

    def test_submit_test_invalid_question_not_part_of_test(self):
        submit_test_data = {
            "data": json.dumps(
                {
                    "test_id": str(self.test_id),
                    "user_response": [
                        {
                            "id": 2,
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
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])
        self.assertTrue(self.response.data["error"])

    def test_submit_test_no_test_id_or_user_response(self):
        submit_test_data = {
            "test_id": self.test_id,
        }
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        self.response = self.client.post(
            reverse("submitTest"), submit_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])
        self.assertTrue(self.response.data["error"])

    def test_submit_test_garbage_data(self):
        submit_test_data = {
            "test_id": "garbage",
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
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
