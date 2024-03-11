from django.test import TestCase, Client
from django.urls import reverse


class TestSignup(TestCase):
    # def setUp(self):

    def test_signup(self):
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "testuser@example.com",
            "password": "testpassword",
            "email": "testuser@example.com",
            "name": "test name",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 201)
        self.assertTrue(self.response.data["ok"])
        self.assertEqual(self.response.data["type"], "student")
        self.assertEqual(self.response.data["email"], "testuser@example.com")

    def test_invalid_user_type(self):
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "testuser",
            "password": "testpassword",
            "email": "testuser@example.com",
            "type": "teacher",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])
        self.assertEqual(self.response.data["error"], "Invalid user type")

    def test_signup_invalid_without_email(self):
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "testuser",
            "password": "testpassword",
            "email": "",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])

    def test_signup_invalid_without_username(self):
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "",
            "password": "testpassword",
            "email": "testuser@example.com",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])
        self.assertEqual(self.response.data["error"], "Invalid user type")

    def test_signup_invalid_without_password(self):
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "testuser",
            "password": "",
            "email": "testuser@example.com",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])

    def test_signup_invalid_without_username_and_password(self):
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "",
            "password": "",
            "email": "testuser@example.com",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])

    def test_signup_invalid_with_repeated_email(self):
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "testuser@example.com",
            "password": "testpassword",
            "email": "testuser@example.com",
            "name": "test name",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 201)
        self.assertTrue(self.response.data["ok"])
        signup_data_same_email = {
            "username": "testuser@example.com",
            "password": "testpassword2",
            "email": "testuser@example.com",
            "type": "student",
        }
        self.client = Client()
        self.response = self.client.post(self.signup_url, signup_data_same_email)
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])
        self.assertEqual(self.response.data["error"], "Email already exists")

    def test_signup_invalid_with_repeated_username(self):
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "testuser@example.com",
            "password": "testpassword",
            "email": "testuser@example.com",
            "name": "test name",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 201)
        self.assertTrue(self.response.data["ok"])
        self.assertEqual(self.response.data["email"], "testuser@example.com")

        signup_data_same_username = {
            "username": "testuser@example.com",
            "password": "testpassword2",
            "email": "testuser@example.com",
            "name": "test name",
            "type": "student",
        }
        self.client = Client()
        self.response = self.client.post(self.signup_url, signup_data_same_username)
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])
        self.assertEqual(self.response.data["error"], "Email already exists")

    def test_signup_invalid_with_invalid_email(self):
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "testuser",
            "password": "testpassword",
            "email": "testuser@example",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])

    def test_signup_invalid_with_invalid_username(self):
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "testuser@",
            "password": "testpassword",
            "email": "testuser@example.com",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])

    def test_signup_invalid_with_invalid_password(self):
        self.client = Client()
        self.signup_url = reverse("signup")
        signup_data = {
            "username": "testuser",
            "password": "test",
            "email": "testuser@example.com",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 400)
        self.assertFalse(self.response.data["ok"])
