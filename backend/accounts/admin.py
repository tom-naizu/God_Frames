from django.contrib import admin
from .models import User, OTP


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'full_name', 'phone', 'auth_provider', 'is_active', 'date_joined']
    search_fields = ['email', 'full_name', 'phone']
    list_filter = ['auth_provider', 'is_active']


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ['phone', 'otp_code', 'is_verified', 'created_at']
    list_filter = ['is_verified']
