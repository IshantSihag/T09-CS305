from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('student/registerForTest/', views.RegisterStudentForTestView.as_view(), name='RegisterStudentForTest'),
    path('student/getResultForTest/',views.GetResultForStudent.as_view(),name='GetResultForStudent'),
]
