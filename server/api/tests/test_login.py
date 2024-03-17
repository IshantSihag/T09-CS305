from django.test import TestCase, Client
from django.urls import reverse


class TestLogin(TestCase):
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

    def test_login_student(self):
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
        self.assertEqual(self.response.data["type"], "student")
        self.assertEqual(self.response.data["name"], "test name student")

    def test_login_institute(self):
        self.client = Client()
        self.signup_url = reverse("login")
        signup_data = {
            "username": "testinstitute@example.com",
            "password": "testpassword",
            "type": "institute",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])
        self.assertEqual(self.response.data["type"], "institute")
        self.assertEqual(self.response.data["name"], "test name institute")

    def test_login_invalid(self):
        self.client = Client()
        self.signup_url = reverse("login")
        signup_data = {
            "username": "testinstitute@example.com",
            "password": "testpassword",
            "type": "invalid",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 401)
        self.assertFalse(self.response.data["ok"])

    def test_login_type_intitute_student(self):
        self.client = Client()
        self.signup_url = reverse("login")
        signup_data = {
            "username": "testinstitute@example.com",
            "password": "testpassword",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 401)
        self.assertFalse(self.response.data["ok"])

    def test_login_invalid_password_institute(self):
        self.client = Client()
        self.signup_url = reverse("login")
        signup_data = {
            "username": "testinstitute@example.com",
            "password": "invalidpassword",
            "type": "institute",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 401)
        self.assertFalse(self.response.data["ok"])

    def test_login_invalid_password_student(self):
        self.client = Client()
        self.signup_url = reverse("login")
        signup_data = {
            "username": "teststudent@example.com",
            "password": "invalidpassword",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 401)
        self.assertFalse(self.response.data["ok"])

    def test_login_invalid_username_student(self):
        self.client = Client()
        self.signup_url = reverse("login")
        signup_data = {
            "username": "invalid_studnet",
            "password": "testpassword",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 401)
        self.assertFalse(self.response.data["ok"])

    def test_login_invalid_username_institute(self):
        self.client = Client()
        self.signup_url = reverse("login")
        signup_data = {
            "username": "invalid_institute",
            "password": "testpassword",
            "type": "institute",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 401)
        self.assertFalse(self.response.data["ok"])

    def test_login_invalid_username_student(self):
        self.client = Client()
        self.signup_url = reverse("login")
        signup_data = {
            "username": "invalid_institute",
            "password": "testpassword",
            "type": "student",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 401)
        self.assertFalse(self.response.data["ok"])

    def test_invalid_data(self):
        self.client = Client()
        self.signup_url = reverse("login")
        signup_data = {
            "username": "testinstitute@example.com",
            "password": "testpassword",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 401)
        self.assertFalse(self.response.data["ok"])

    # As the serializer should behave the same as with or without the garbage data
    def test_stress_garbage_post_data(self):
        self.client = Client()
        self.signup_url = reverse("login")
        signup_data = {
            "username": "testinstitute@example.com",
            "password": "testpassword",
            "type": "institute",
            "garbage": "garbage",
        }
        self.response = self.client.post(self.signup_url, signup_data)
        self.assertEqual(self.response.status_code, 200)
        self.assertTrue(self.response.data["ok"])

    def test_garbage_only(self):
        self.client = Client()
        self.signup_url = reverse("login")
        self.data = {
            "garbage": "garbage",
        }
        self.response = self.client.post(self.signup_url, self.data)
        self.assertEqual(self.response.status_code, 401)
        self.assertFalse(self.response.data["ok"])
