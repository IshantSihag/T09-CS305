from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenBlacklistView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("home/", views.HomeView.as_view(), name="home"),
    path('logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path("signup/", views.SignUpView.as_view(), name="signup"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("startTest/", views.startTest.as_view(), name="startTest"),
    path("home/profile", views.ProfileView.as_view(), name="profile"),
    path("deleteTest/", views.deleteTest.as_view(), name="deleteTest"),
    path("createTest/", views.createTest.as_view(), name="createTest"),
    path(
        "student/getAllTests/",
        views.GetAllTestStudentView.as_view(),
        name="getAllTestsStudent",
    ),
    path("getTest/", views.getTest.as_view(), name="getTest"),
]
