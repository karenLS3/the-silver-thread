from django.urls import path
from .views import RegisterUser, LoginView, UpdatePinView

urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('update-pin/', UpdatePinView.as_view(), name='update-pin'),
]
