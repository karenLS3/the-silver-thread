from rest_framework import serializers
from .models import User
import phonenumbers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'name', 'last_name', 'phone_number')

    def validate_phone_number(self, value):
        phone_number = phonenumbers.parse(value, "US")
        if not phonenumbers.is_valid_number(phone_number):
            raise serializers.ValidationError("Invalid phone number")
        return phonenumbers.format_number(phone_number, phonenumbers.PhoneNumberFormat.E164)
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
