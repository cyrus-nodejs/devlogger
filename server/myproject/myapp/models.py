from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField
from taggit.managers import TaggableManager

from django.contrib.auth.models import AbstractUser

from django.db import models
from django.conf import settings

from django.db import models

class CustomUser(AbstractUser):
    mobile_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    display_name = models.CharField( max_length=100, blank=True, null=True)
    github_token = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.username
    
class RepoActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    repo_name = models.CharField(max_length=255)
    date = models.DateField()
    commits_count = models.IntegerField(default=0)
    code_frequency = models.JSONField(blank=True, null=True)  # last week's additions/deletions

    class Meta:
        unique_together = ('user', 'repo_name', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.repo_name} - {self.date}"
    
class ManualCodingLog(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    project_name = models.CharField(max_length=100)
    language = models.CharField(max_length=100)
    duration = models.DurationField()
    notes = models.TextField(blank=True)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    tags = TaggableManager()

    def __str__(self):
        return f"{self.user.username} - {self.project_name}"


