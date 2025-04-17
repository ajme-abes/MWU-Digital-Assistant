# invitations/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.utils import timezone
from .models import Invitation
from .serializers import InvitationCreateSerializer, InvitationListSerializer
from university.models import Department
from core.permissions import IsHOD

class InvitationCreateView(generics.CreateAPIView):
    serializer_class = InvitationCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsHOD]

    def get_queryset(self):
        return Invitation.objects.filter(
            department=self.request.user.department,
            created_by=self.request.user
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invitation = serializer.save()
        return Response({
            "code": invitation.code,
            "expires_at": invitation.expires_at,
            "max_uses": invitation.max_uses
        }, status=201)

class InvitationListView(generics.ListAPIView):
    serializer_class = InvitationListSerializer
    permission_classes = [permissions.IsAuthenticated, IsHOD]

    def get_queryset(self):
        return Invitation.objects.filter(
            department=self.request.user.department,
            created_by=self.request.user
        ).order_by('-created_at')