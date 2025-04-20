from django.contrib import admin
from .models import Invitation
from django import forms

class InvitationAdminForm(forms.ModelForm):
    expiration_hours = forms.IntegerField(
        min_value=1,
        max_value=168,
        initial=72,
        help_text="Hours until expiration"
    )

    class Meta:
        model = Invitation
        fields = ['invitation_type', 'expiration_hours', 'max_uses']

@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    form = InvitationAdminForm
    list_display = ('code', 'invitation_type', 'department', 'is_valid')
    readonly_fields = ('code', 'created_by', 'department')
    list_filter = ('department__college', 'invitation_type')
    search_fields = ('code', 'department__name')

    def save_model(self, request, obj, form, change):
        if not change:
            obj.department = request.user.department
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            qs = qs.filter(department=request.user.department)
        return qs