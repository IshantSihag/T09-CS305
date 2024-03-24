from django.urls import path
from . import views

urlpatterns = [
    path("verifyUser/", views.VerifyUserView.as_view(), name="verifyUser"),
    path("submitInitailImage/", views.SubmitInitalImage.as_view(), name="submitInitailImage"),
]
