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

    def test_create_test(self):
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

    def test_create_test_without_marks(self):
        create_test_data = {
            "title": "QUIZ",
            "start": "2024-03-24 +0000",
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
                        "marks": "",
                        "negative_marks": "",
                    }
                ]
            ),
        }
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        self.response = self.client.post(
            reverse("createTest"), create_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])

    def test_create_test_without_questions(self):
        create_test_data = {
            "title": "QUIZ",
            "start": "2024-03-24 +0000",
            "duration": "3600",
            "questions": json.dumps([]),
        }
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        self.response = self.client.post(
            reverse("createTest"), create_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])

    def test_create_without_jwt_verification(self):
        create_test_data = {
            "title": "QUIZ",
            "start": "2024-03-24 +0000",
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
        self.response = self.client.post(reverse("createTest"), create_test_data)
        self.assertEqual(self.response.status_code, 401)

    def test_create_test_with_invalid_jwt(self):
        create_test_data = {
            "title": "QUIZ",
            "start": "2024-03-24 +0000",
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
        headers = {"HTTP_AUTHORIZATION": "Bearer " + "invalid_jwt"}
        self.response = self.client.post(
            reverse("createTest"), create_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 401)

    def test_create_test_with_invalid_time(self):
        create_test_data = {
            "title": "QUIZ",
            "start": "2024-03-24 +0000",
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
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])

    def test_create_test_with_invalid_questions(self):
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
                    }
                ]
            ),
        }
        headers = {"HTTP_AUTHORIZATION": "Bearer " + self.jwt_token}
        self.response = self.client.post(
            reverse("createTest"), create_test_data, **headers
        )
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])

    def pending_test_create_test_with_invalid_question_type(self):
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
                        "type": "invalid",
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
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])

    def pending_test_create_test_with_invalid_duration(self):
        create_test_data = {
            "title": "QUIZ",
            "start": "2024-03-24 21:11 +0000",
            "duration": "-3600",
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
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])
