from django.urls import path
from . import views

urlpatterns = [
    path("testresult/", views.TestResultView.as_view(), name="testresult"),
    path("submitTest/", views.SubmitTestView.as_view(), name="submitTest"),
    path("clocksync/", views.clocksyncView.as_view(), name="clocksync"),
]
