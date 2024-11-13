from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Contact
from .serializers import ContactSerializer

class ContactListCreateView(generics.ListCreateAPIView):
    """
    View to list all contacts for the authenticated user and create new contacts.
    """
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter contacts to only those belonging to the authenticated user
        return Contact.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the contact's user to the authenticated user
        serializer.save(user=self.request.user)

class ContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or delete a specific contact by ID.
    """
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure the authenticated user only accesses their own contacts
        return Contact.objects.filter(user=self.request.user)
