from django.test import TestCase, Client
from django.urls import reverse


class TestLogin(TestCase):
    def setUp(self):
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

    def test_login(self):
        self.client = Client()
        self.signup_url = reverse("login")
        signup_data = {
            "username": "testuser@example.com",
            "password": "testpassword",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
