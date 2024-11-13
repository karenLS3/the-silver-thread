from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from .models import User
from rest_framework_jwt.settings import api_settings
from django.core.mail import send_mail
from django.contrib.auth import authenticate
import random
from django.utils.crypto import get_random_string
from rest_framework_simplejwt.tokens import RefreshToken

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

class RegisterUser(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            temp_pin = get_random_string(length=4, allowed_chars='0123456789')
            user.set_password(temp_pin)  # Temporarily set as password
            user.is_temporary_pin = True
            user.save()
            # Email the temporary PIN
            send_mail(
                "Your Verification PIN",
                f"Use this PIN to log in: {temp_pin}",
                "no-reply@myapp.com",
                [user.email],
            )
            return Response({"message": "Account created! Check your email for the PIN."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdatePinView(APIView):
    def post(self, request):
        email = request.data.get('email')
        new_pin = request.data.get('new_pin')
        try:
            user = User.objects.get(email=email)
            if user.is_temporary_pin:
                user.set_password(new_pin)
                user.is_temporary_pin = False 
                user.save()
                return Response({'message': 'PIN updated successfully. You can now log in with your new PIN.'}, status=status.HTTP_200_OK)
            return Response({'detail': 'PIN has already been personalized'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        pin_code = request.data.get('pin_code')
        try:
            user = User.objects.get(email=email)
            if user.check_password(pin_code):
                if user.is_temporary_pin:
                    return Response({'message': 'First login successful. Please update your PIN.'}, status=status.HTTP_200_OK)
                else:
                    refresh = RefreshToken.for_user(user)
                    user_data = {
                        'id': user.id,
                        'email': user.email,
                        'name': user.name,
                        'last_name': user.last_name,
                        'phone_number': user.phone_number,
                    }
                    return Response({'refresh': str(refresh), 'access': str(refresh.access_token), 'user': user_data}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
