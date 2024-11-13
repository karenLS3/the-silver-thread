from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
import phonenumbers

class UserManager(BaseUserManager):
    def create_user(self, email, name, last_name, phone_number, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        if not name:
            raise ValueError("Users must have a name")
        if not last_name:
            raise ValueError("Users must have a last name")
        if not phone_number:
            raise ValueError("Users must have a phone number")
        user = self.model(
            email=self.normalize_email(email),
            name=name,
            last_name=last_name,
            phone_number=phone_number,
            **extra_fields
        )
        user.set_password(extra_fields.get('password'))
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=30, blank=True, default="")
    last_name = models.CharField(max_length=30, blank=True, default="")
    phone_number = models.CharField(max_length=15, unique=True)
    is_temporary_pin = models.BooleanField(default=True) 

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'last_name', 'phone_number']
