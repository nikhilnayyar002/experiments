from django.urls import path
from . import views

urlpatterns = [
   path('',views.helloWorld),
   path('<str:user_id>',views.index),
]
