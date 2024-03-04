from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.HomeView.as_view(), name='home'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('login/', views.MyObtainTokenPairView.as_view(), name='login'),
    path('home/profile',views.ProfileView.as_view(),name='profile'),
    path('home/profile/update',views.UpdateProfileView.as_view(),name='update')
]