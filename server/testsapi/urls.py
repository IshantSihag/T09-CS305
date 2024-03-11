from django.urls import path
from . import views

urlpatterns = [
    path("testresult/", views.TestResultView.as_view(), name="testresult"),
]
