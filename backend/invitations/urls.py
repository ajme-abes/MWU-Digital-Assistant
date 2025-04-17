# invitations/urls.py
from django.urls import path
from .views import InvitationCreateView, InvitationListView

app_name = 'invitations'

urlpatterns = [
    path('generate/', InvitationCreateView.as_view(), name='create'),
    path('list/', InvitationListView.as_view(), name='list'),
]