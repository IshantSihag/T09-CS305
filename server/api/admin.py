from django.contrib import admin
from .models import Test, Question, UserProfile, Response, Result, Student

# Register your models here.
admin.site.register(Test)
admin.site.register(Question)
admin.site.register(UserProfile)
admin.site.register(Response)
admin.site.register(Result)
admin.site.register(Student)
