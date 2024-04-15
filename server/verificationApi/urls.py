from django.urls import path
from . import views

urlpatterns = [
    path("verifyUser/", views.VerifyUserView.as_view(), name="verifyUser"),
    path(
        "submitInitialImage/",
        views.SubmitInitialImage.as_view(),
        name="submitInitialImage",
    ),
    path("submitTestRating/", views.TestRatingView.as_view(), name="submitTestRating"),
    path("fetchTest/", views.FetchTestView.as_view(), name="fetchTest"),
]
