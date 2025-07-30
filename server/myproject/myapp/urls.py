from django.urls import path, include

from rest_framework_simplejwt.views import (

    TokenRefreshView
)

# from .views.Index import IndexView


from .views.auth_views import (
    RegisterUserView,
    AuthUserView,
    ForgotPasswordView,
    ResetPasswordView,
    LogoutView,
    CustomTokenObtainPairView,
    GoogleLoginView,
    GithubAuthView

    
)


from .views.githubactivity_views import (
        GitHubActivityView
)
from .views.manualcodinglog_views import (
    ManualCodingLogDetailAPIView,
    ManualCodingLogListCreateAPIView
)

urlpatterns = [
    
    ## Auth  url
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/', AuthUserView.as_view(), name='authuser'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),

    ##Password Recovery
    path('request-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    
    ##Socail auth
    path('google-login/', GoogleLoginView.as_view(), name='google-login'),
    path('github/', GithubAuthView.as_view(), name='github-auth'),
 
     
     path('sessions/', ManualCodingLogListCreateAPIView.as_view(), name='api_sessions'),
     path('sessions/<int:pk>/', ManualCodingLogDetailAPIView.as_view(), name='api_session_detail'),
    #  path('sync/', TriggerSyncView.as_view(), name='trigger-sync'),
     path("github-activity/", GitHubActivityView.as_view(), name="github-activity")
    

 
    

]