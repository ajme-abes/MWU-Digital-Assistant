from allauth.account.adapter import DefaultAccountAdapter

class CustomAccountAdapter(DefaultAccountAdapter):
    def save_user(self, request, user, form, commit=True):
        user = super().save_user(request, user, form, commit=False)
        user.role = form.cleaned_data.get('role', 'student')
        # Add department handling if needed
        if commit:
            user.save()
        return user