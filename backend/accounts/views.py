import random
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .models import User, OTP
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    GoogleAuthSerializer, SendOTPSerializer, VerifyOTPSerializer
)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response({
            'message': 'Account created successfully',
            'user': UserSerializer(user).data,
            'tokens': tokens,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'tokens': tokens,
        })
    return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth_view(request):
    serializer = GoogleAuthSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    token = serializer.validated_data['token']

    try:
        # Verify Google token
        idinfo = id_token.verify_oauth2_token(
            token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
        )
        email = idinfo.get('email')
        name = idinfo.get('name', '')

        if not email:
            return Response({'error': 'Email not found in Google token'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'full_name': name,
                'auth_provider': 'google',
            }
        )

        if not created and not user.full_name:
            user.full_name = name
            user.save()

        tokens = get_tokens_for_user(user)
        return Response({
            'message': 'Google login successful',
            'user': UserSerializer(user).data,
            'tokens': tokens,
            'is_new': created,
        })

    except ValueError:
        # For development - accept any token and create a mock user
        if settings.DEBUG:
            email = f'google_user_{token[:8]}@gmail.com'
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'full_name': 'Google User',
                    'auth_provider': 'google',
                }
            )
            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Google login successful (dev mode)',
                'user': UserSerializer(user).data,
                'tokens': tokens,
                'is_new': created,
            })
        return Response({'error': 'Invalid Google token'},
                        status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp_view(request):
    serializer = SendOTPSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    phone = serializer.validated_data['phone']

    if settings.OTP_DEV_MODE:
        otp_code = settings.OTP_DEV_CODE
    else:
        otp_code = str(random.randint(100000, 999999))
        # TODO: Send OTP via SMS provider (Twilio, MSG91, etc.)

    # Save OTP
    OTP.objects.create(phone=phone, otp_code=otp_code)

    return Response({
        'message': f'OTP sent to +91 {phone}',
        'dev_otp': otp_code if settings.OTP_DEV_MODE else None,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp_view(request):
    serializer = VerifyOTPSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    phone = serializer.validated_data['phone']
    otp_input = serializer.validated_data['otp']

    # Check OTP
    otp_record = OTP.objects.filter(
        phone=phone, is_verified=False
    ).order_by('-created_at').first()

    if not otp_record:
        return Response({'error': 'No OTP found. Please request a new one.'},
                        status=status.HTTP_400_BAD_REQUEST)

    if otp_record.otp_code != otp_input:
        return Response({'error': 'Invalid OTP'},
                        status=status.HTTP_400_BAD_REQUEST)

    otp_record.is_verified = True
    otp_record.save()

    # Get or create user by phone
    user, created = User.objects.get_or_create(
        phone=phone,
        defaults={
            'email': f'{phone}@phone.godsframe.com',
            'auth_provider': 'phone',
        }
    )

    tokens = get_tokens_for_user(user)
    return Response({
        'message': 'Phone verified successfully',
        'user': UserSerializer(user).data,
        'tokens': tokens,
        'is_new': created,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    return Response(UserSerializer(request.user).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
