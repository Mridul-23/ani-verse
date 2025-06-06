from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, RefreshToken
from rest_framework.exceptions import ValidationError




class RegisterView(APIView):
    """
    View for user registration. This endpoint allows new users to create an account.
    On successful registration, JWT access and refresh tokens are provided.
    
    Methods:
        post: Registers a new user with username and password.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Registers a new user with the provided username and password.
        
        Args:
            request (Request): The HTTP request object with 'username' and 'password' in the body.

        Returns:
            Response: JSON response containing access and refresh tokens if successful,
                      or an error message if the username already exists.
        """
        # Extract username and password from request data
        username = request.data.get('username')
        password = request.data.get('password')

        # Field presence validation
        if not username or not password:
            raise ValidationError({"detail": "Username and password are required."})

        if User.objects.filter(username=username).exists():
            raise ValidationError({"username": ["A user with that username already exists."]})

        if len(password) < 6:
            raise ValidationError({"password": ["Password must be at least 6 characters long."]})

        user = User.objects.create_user(username=username, password=password)
        user.save()

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return Response({
            'message': 'User created successfully',
            'access': access_token,
            'refresh': refresh_token,
        }, status=status.HTTP_201_CREATED)
    



class LoginView(APIView):
    """
    View for user login. This endpoint authenticates the user and provides JWT access and refresh tokens.
    
    Methods:
        post: Authenticates user with username and password.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Authenticates the user and provides JWT access and refresh tokens.

        On success, returns an object with two tokens:
            - `access`: JWT access token for the user.
            - `refresh`: JWT refresh token for the user.

        On failure, returns an error message.

        Methods:
            post:
                Authenticates user with provided username and password. Returns JWT tokens on success or an error on failure.
        """

        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error' : 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        
        if user is not None:
            access_token = AccessToken.for_user(user)
            refresh_token = RefreshToken.for_user(user)

            return Response({'access' : str(access_token), 'refresh' : str(refresh_token)}, status=status.HTTP_200_OK)


        return Response({'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)
