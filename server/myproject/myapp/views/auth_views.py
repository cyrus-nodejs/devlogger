
import os
from rest_framework.permissions import IsAuthenticated

import requests
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from ..serializers import  CustomUserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.template.loader import render_to_string
from ..models import CustomUser
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenObtainPairView
from ..serializers import CustomTokenObtainPairSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests 
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from social_django.utils import load_backend, load_strategy
from django.contrib.auth import login

# from myapp.tasks import sync_github_activity

from django.conf import settings



class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            return Response({"message":  "Success! Proceed to Login."
                             }, status=status.HTTP_201_CREATED)

        except ValidationError as ve:
            return Response({
                "message": "Validation error",
                "errors": ve.detail
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "message": "An unexpected error occurred.",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer 

class LogoutView(APIView):
     permission_classes = [IsAuthenticated]

     def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

   


class AuthUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

    

        user_data = {
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'mobile_number': user.mobile_number,
            'display_name': user.display_name,  # assuming this field exists
            'is_staff': user.is_staff,
            'is_active': user.is_active,
            "github_token": user.github_token,
            'date_joined': user.date_joined,
        }
        
      

        return Response(
            {
                "message": "User authenticated!",
                "user": user_data
            },
            status=status.HTTP_200_OK
        )
    
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # Generate token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(str(user.pk).encode())
        reset_link = f'http://localhost:5173/reset-password/{uid}/{token}/'

        # Send reset email
        subject = 'Password Reset'
        message = render_to_string('password_reset_email.html', {'reset_link': reset_link})
        send_mail(subject, message, 'admin@example.com', [email])

        return Response({"detail": "Password reset link has been sent to your email."}, status=status.HTTP_200_OK)
  


class ResetPasswordView(APIView):
   permission_classes = [AllowAny]
   def post(self, request, *args, **kwargs):
        uid = request.data.get('uid')
        token = request.data.get('token')
        password = request.data.get('password')

        try:
            uid = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Invalid token or user."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save()

        return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)
   

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        token = request.data.get('credential')

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                os.getenv('Google_ClientId')
               
                
            )

            email = idinfo['email']
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')

            user, created = CustomUser.objects.get_or_create(email=email, defaults={
                'username': email,
                'first_name': first_name,
                'last_name': last_name,
            })

            refresh = RefreshToken.for_user(user)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })

        except ValueError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        


class GithubAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({"error": "Missing code"}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Exchange code for access token
        client_id = settings.GITHUB_CLIENT_ID
        client_secret = settings.GITHUB_CLIENT_SECRET
        token_url = 'https://github.com/login/oauth/access_token'
        headers = {'Accept': 'application/json'}
        data = {
            'client_id': client_id,
            'client_secret': client_secret,
            'code': code,
        }

        try:
            token_response = requests.post(token_url, data=data, headers=headers)
            token_response.raise_for_status()
            access_token = token_response.json().get('access_token')
            if not access_token:
                return Response({"error": "Failed to get access token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Token exchange failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Get basic user info
        user_info_response = requests.get(
            'https://api.github.com/user',
            headers={'Authorization': f'token {access_token}'}
        )
        user_info_response.raise_for_status()
        user_info = user_info_response.json()

        username = user_info.get('login')
        email = user_info.get('email')  # Often None

        # Step 3: Fetch primary verified email if not available
        if not email:
            emails_response = requests.get(
                'https://api.github.com/user/emails',
                headers={'Authorization': f'token {access_token}'}
            )
            emails_response.raise_for_status()
            emails = emails_response.json()
            # Look for primary and verified email
            email = next(
                (e['email'] for e in emails if e.get('primary') and e.get('verified')),
                None
            )

        # Step 4: Fallback email
        if not email:
            email = f"{user_info['id']}@users.noreply.github.com"

        # Step 5: Get or create user
        user, created = CustomUser.objects.get_or_create(
            username=email,
            defaults={"email": email}
        )
        user.github_token = access_token
        user.save(update_fields=['github_token'])

        # Authenticate user
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)

        # Step 6: Issue tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })




