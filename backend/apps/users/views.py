# backend/apps/users/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User, Category, Expense, ChildrenContribution, Milestone, UserMilestone, UserResponse
from .serializers import (
    UserSerializer, UserRegistrationSerializer, CategorySerializer,
    ExpenseSerializer, ChildrenContributionSerializer, MilestoneSerializer,
    UserMilestoneSerializer, UserResponseSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'register', 'login']:
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not password:
            return Response(
                {'error': 'Password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if username:
                user = User.objects.get(username=username)
            elif email:
                user = User.objects.get(email=email)
            else:
                return Response(
                    {'error': 'Username or email is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if user.check_password(password):
                serializer = self.get_serializer(user)
                return Response({
                    'message': 'Login successful',
                    'user': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

    @action(detail=False, methods=['get', 'put', 'patch'])
    def profile(self, request):
        if request.method == 'GET':
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        
        partial = request.method == 'PATCH'
        serializer = UserSerializer(request.user, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def expenses(self, request, pk=None):
        user = self.get_object()
        expenses = user.expenses.all()
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def children_contributions(self, request, pk=None):
        user = self.get_object()
        contributions = user.children_contributions.all()
        serializer = ChildrenContributionSerializer(contributions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def milestones(self, request, pk=None):
        user = self.get_object()
        user_milestones = user.user_milestones.all()
        serializer = UserMilestoneSerializer(user_milestones, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def responses(self, request, pk=None):
        user = self.get_object()
        responses = user.user_responses.all()
        serializer = UserResponseSerializer(responses, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user_id', None)
        category_id = self.request.query_params.get('category_id', None)

        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        return queryset


class ChildrenContributionViewSet(viewsets.ModelViewSet):
    queryset = ChildrenContribution.objects.all()
    serializer_class = ChildrenContributionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user_id', None)

        if user_id:
            queryset = queryset.filter(user_id=user_id)

        return queryset


class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer


class UserMilestoneViewSet(viewsets.ModelViewSet):
    queryset = UserMilestone.objects.all()
    serializer_class = UserMilestoneSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user_id', None)
        is_completed = self.request.query_params.get('is_completed', None)

        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if is_completed is not None:
            queryset = queryset.filter(is_completed=is_completed.lower() == 'true')

        return queryset

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        from django.utils import timezone
        user_milestone = self.get_object()
        user_milestone.is_completed = True
        user_milestone.completed_at = timezone.now()
        user_milestone.save()
        serializer = self.get_serializer(user_milestone)
        return Response(serializer.data)


class UserResponseViewSet(viewsets.ModelViewSet):
    queryset = UserResponse.objects.all()
    serializer_class = UserResponseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user_id', None)

        if user_id:
            queryset = queryset.filter(user_id=user_id)

        return queryset