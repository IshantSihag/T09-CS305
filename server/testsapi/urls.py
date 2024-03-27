from django.urls import path
from . import views

urlpatterns = [
    path("testresult/", views.TestResultView.as_view(), name="testresult"),
    path("submitTest/", views.SubmitTestView.as_view(), name="submitTest"),
    path("clocksync/", views.clocksyncView.as_view(), name="clocksync"),
    path("dashboard/", views.DashboardView.as_view(), name="dashboard"),
    path("getTestDetails/", views.getTestDetailsView.as_view(), name="getTestDetails"),
]
