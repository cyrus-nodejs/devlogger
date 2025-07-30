# accounts/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, ManualCodingLog, RepoActivity




class CustomUserAdmin(UserAdmin):
    # Add the custom fields to the admin interface
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('mobile_number', 'display_name')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('mobile_number','display_name')}),
    )

    # Fields to display in the admin user list
    list_display = ['username', 'email', 'first_name', 'last_name', 'mobile_number', 'display_name', 'is_staff', 'github_token']
    search_fields = ['username', 'email', 'mobile_number']



class ManualCodingLogAdmin(admin.ModelAdmin):
    list_display = (
        "project_name",
        "language",
        "user",
        "start_time",
        "end_time",
        "duration",
    )
    list_filter = ("language", "tags", "start_time")
    search_fields = ("project_name", "language", "tags", "notes")
    ordering = ("-start_time",)
    readonly_fields = ("duration",)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")
    


@admin.register(RepoActivity)
class RepoActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'repo_name', 'date', 'commits_count')
    list_filter = ('user', 'date')
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(ManualCodingLog, ManualCodingLogAdmin)
