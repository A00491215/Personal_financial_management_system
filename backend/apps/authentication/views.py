from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
from drf_spectacular.types import OpenApiTypes

@extend_schema(
    tags=['Authentication'],
    summary='Create authentication session',
    description='Authenticate user with email and password, returns JWT tokens',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'email': {
                    'type': 'string',
                    'format': 'email',
                    'description': 'User email address'
                },
                'password': {
                    'type': 'string',
                    'description': 'User password'
                }
            },
            'required': ['email', 'password'],
            'example': {
                'email': 'john.doe@example.com',
                'password': 'securePassword123!'
            }
        }
    },
    responses={
        200: OpenApiResponse(
            description='Authentication successful',
            examples={
                'application/json': {
                    'access': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
                    'refresh': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
                    'user': {
                        'id': 1,
                        'email': 'john.doe@example.com',
                        'full_name': 'John Doe'
                    }
                }
            }
        ),
        400: OpenApiResponse(
            description='Missing required fields',
            examples={
                'application/json': {
                    'error': 'Email and password required'
                }
            }
        ),
        401: OpenApiResponse(
            description='Invalid credentials',
            examples={
                'application/json': {
                    'error': 'Invalid credentials'
                }
            }
        )
    }
)
@api_view(['POST'])
@permission_classes([AllowAny])
def create_session(request):
    """Create JWT session with email and password"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Email and password required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=email, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name
            }
        })
    
    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )