from rest_framework import generics, status
from rest_framework.response import Response
from .models import Invitation
from .serializers import InvitationCreateSerializer, InvitationListSerializer
from core.permissions import IsHOD

class InvitationCreateView(generics.CreateAPIView):
    serializer_class = InvitationCreateSerializer
    permission_classes = [IsHOD]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invitation = serializer.save()
        return Response(
            InvitationListSerializer(invitation).data,
            status=status.HTTP_201_CREATED
        )

class InvitationListView(generics.ListAPIView):
    serializer_class = InvitationListSerializer
    permission_classes = [IsHOD]

    def get_queryset(self):
        return Invitation.objects.filter(
            department=self.request.user.department
        ).select_related('department', 'department__college')