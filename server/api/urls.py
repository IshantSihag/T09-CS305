from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('home/', views.HomeView.as_view(), name='home'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('startTest/', views.startTest.as_view(), name='startTest'),
    path('home/profile',views.ProfileView.as_view(),name='profile'),
    path('deleteTest/', views.deleteTest.as_view(), name='deleteTest'),
    path('getAllTestsStudent/',views.GetAllTestStudentView.as_view(),name="getAllTestsStudent"),
    path('getTest/', views.getTest.as_view(), name='getTest'),
]