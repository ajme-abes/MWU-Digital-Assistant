from django.contrib import admin
from django.utils import timezone
from .models import Invitation

@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ('code', 'department', 'invitation_type', 'created_by', 'expires_at', 'is_valid')
    list_filter = ('department__college', 'department', 'invitation_type')
    search_fields = ('code',)
    readonly_fields = ('created_at',)
    autocomplete_fields = ['department', 'created_by']

    def is_valid(self, obj):
        now = timezone.now()
        return obj.expires_at > now and obj.used_count < obj.max_uses
    is_valid.boolean = True
    is_valid.short_description = 'Valid'