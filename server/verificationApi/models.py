from django.db import models
from django.contrib.auth.models import User
from api.models import Test

# Create your models here.


class UserImage(models.Model):
    user_id = models.OneToOneField(
        User, related_name="userdetails", default=1, on_delete=models.CASCADE
    )
    image_url = models.CharField(max_length=255, blank=True, null=True)
    image_base64 = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user_id


class TestRating(models.Model):
    test_id = models.ForeignKey(Test, on_delete=models.CASCADE)
    rating = models.IntegerField()
    suggestion = models.TextField(blank=True, null=True)
