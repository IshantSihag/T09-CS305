from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import UserProfile

class SignUpViewSerializer(serializers.ModelSerializer):  # contains name, email, password
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], email=validated_data['username'], password=validated_data['password'])
        return user
    
    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.set_password(validated_data.get('password', instance.password))
        instance.save()
        return instance
    
    def validate(self, data):
        email = data.get('email', None)
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'Email is already in use'})
        return super().validate(data)
  



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token['username'] = user.username
        return token


# class LoginViewSerializer(serializers.Serializer):  # contains email, password
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email', 'password')
#         extra_kwargs = {'password': {'write_only': True}}
        
    
#     def validate(self, data):
#         email = data.get('email', None)
#         password = data.get('password', None)
#         if not User.objects.filter(email=email, password=password).exists():
#             return serializers.ValidationError({'email': 'Email or password is incorrect'})
#         return super().validate(data)
    
class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserProfile
        fields = ( 'name', 'profile_url', 'bio', 'tests','type')

class ProfileViewSerializer(serializers.ModelSerializer):
    userdetails=UserProfileSerializer(many=False)
    class Meta:
        model=User
        fields=('username','email','userdetails')
class UpdateUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ( 'name', 'profile_url', 'bio',)
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.profile_url = validated_data.get('profile_url', instance.profile_url)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.save()
        return instance