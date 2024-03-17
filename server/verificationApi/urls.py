from django.urls import path
from . import views

urlpatterns = [
    path("verifyUser/", views.VerifyUserView.as_view(), name="verifyUser"),
]
