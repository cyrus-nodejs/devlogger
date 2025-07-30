from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomUser, ManualCodingLog, RepoActivity
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework import serializers


User = get_user_model()


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'mobile_number', 'first_name', 'last_name',  'display_name', 'password','github_token']
        extra_kwargs = {
            'password': {'write_only': True},
             'email': {'required': True},
            'username': {'required': True}
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            mobile_number=validated_data.get('mobile_number', ''),
            display_name=validated_data.get('display_name', '')
        )
        return user

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
          raise serializers.ValidationError("Email is already in use.")
        return value




class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Get the default token (access + refresh)
        token = super().get_token(user)

        # Add custom claims (extra fields in access token)
        token['username'] = user.username
        token['email'] = user.email
        token['display_name'] = user.display_name
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['mobile_number'] = user.mobile_number

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Optional: Add extra user info to the response
        data.update({
            'user_id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'display_name': self.user.display_name,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'mobile_number': self.user.mobile_number,
        })

        return data


class ManualCodingLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManualCodingLog
        fields = '__all__'
        read_only_fields = ['user']






# class RepoActivitySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RepoActivity
#         fields = [
#             'id',
#             'repo_name',
#             'date',
#             'commits_count',
#             'code_frequency'
#         ]

      


class TimePerDaySerializer(serializers.Serializer):
    date = serializers.DateField()
    total_minutes = serializers.IntegerField()

class CommitsPerDaySerializer(serializers.Serializer):
    date = serializers.DateField()
    total_commits = serializers.IntegerField()

class LanguageUsageSerializer(serializers.Serializer):
    language = serializers.CharField()
    count = serializers.IntegerField()

class DashboardChartDataSerializer(serializers.Serializer):
    time_per_day = TimePerDaySerializer(many=True)
    commits_per_day = CommitsPerDaySerializer(many=True)
    language_usage = LanguageUsageSerializer(many=True)
