from django.db import models
from django.contrib.auth.models import User

QUESTION_TYPES = (
    ("single", "Single Correct"),
    ("multiple", "Multiple Correct"),
)


# Create your models here.
class Test(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100, blank=False, null=False)
    start = models.DateTimeField()
    duration = models.IntegerField()  # Number of seconds
    author = models.CharField(max_length=100, blank=False, null=False)
    questions = models.TextField()
    testCode = models.CharField(max_length=100, blank=False, null=False)
    registrations = models.TextField(blank=True)


class Question(models.Model):
    id = models.AutoField(primary_key=True)
    statement = models.TextField()
    type = models.CharField(max_length=32, default="single", choices=QUESTION_TYPES)
    marks = models.IntegerField()
    options = models.TextField()
    answer = models.TextField()
    test_id = models.ForeignKey(Test, on_delete=models.CASCADE)


class UserProfile(models.Model):
    user_id = models.OneToOneField(
        User, related_name="userdetails", default=1, on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)
    profile_url = models.TextField(blank=True)
    bio = models.TextField(blank=True)
    tests = models.TextField(blank=True)
    type = models.CharField(
        max_length=32,
        default="student",
        choices=(("student", "Student"), ("institute", "Institute")),
    )


class Response(models.Model):
    student_id = models.IntegerField()
    test_id = models.ForeignKey(Test, on_delete=models.CASCADE)
    question_id = models.ForeignKey(Question, on_delete=models.CASCADE)
    response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


class Result(models.Model):
    student_id = models.IntegerField()
    test_id = models.ForeignKey(Test, on_delete=models.CASCADE)
    score = models.IntegerField()
