from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from .models import UserProfile,User
from rest_framework.permissions import IsAuthenticated

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        # Your custom permission logic here
        if not IsAuthenticated().has_permission(request, view):
            return False
        userprofile = UserProfile.objects.get(user_id=request.user)
        if(userprofile.type=='student'):
            return True
        else:
            raise PermissionDenied(detail="Need to be a Student to access.")

class IsInstitute(BasePermission):
    def has_permission(self, request, view): 
        if not IsAuthenticated().has_permission(request, view):
            return False
        userprofile = UserProfile.objects.get(user_id=request.user)
        if(userprofile.type=='institute'):
            return True
        else:
            raise PermissionDenied(detail="Need to be an Institute to access.")