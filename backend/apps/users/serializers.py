# backend/apps/users/serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from .models import (
    User, Category, Expense, ChildrenContribution,
    Milestone, UserMilestone, UserResponse
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'user_id', 'username', 'email', 'password', 'salary',
            'total_balance', 'budget_preference', 'email_notification',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'user_id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super().update(instance, validated_data)


class LoginSerializer(serializers.Serializer):
    """Simple login serializer without JWT"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('User not found. Please register.')

        if not user.check_password(password):
            raise serializers.ValidationError('Invalid password')

        return {
            'user': UserSerializer(user).data,
            'message': 'Login successful'
        }


# backend/apps/users/serializers.py

class JWTLoginSerializer(serializers.Serializer):
    """Login serializer with JWT tokens"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'error': 'User not found. Please register.'})

        if not user.check_password(password):
            raise serializers.ValidationError({'error': 'Invalid password'})

        # Generate JWT tokens - DON'T use RefreshToken.for_user()
        # Create tokens manually since your User model uses user_id not id
        refresh = RefreshToken()
        refresh['user_id'] = user.user_id
        refresh['email'] = user.email
        
        access = refresh.access_token
        access['user_id'] = user.user_id
        access['email'] = user.email

        return {
            'user': {
                'user_id': user.user_id,
                'username': user.username,
                'email': user.email,
                'salary': str(user.salary) if user.salary else None,
                'total_balance': str(user.total_balance),
                'budget_preference': user.budget_preference,
            },
            'access': str(access),
            'refresh': str(refresh),
            'message': 'Login successful'
        }


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'name']
        extra_kwargs = {
            'category_id': {'read_only': True}
        }


class ExpenseSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user_id.username', read_only=True)
    category_name = serializers.CharField(source='category_id.name', read_only=True)

    class Meta:
        model = Expense
        fields = [
            'expense_date', 'user_id', 'category_id', 'amount',
            'created_at', 'user_username', 'category_name'
        ]
        extra_kwargs = {
            'created_at': {'read_only': True}
        }


class ChildrenContributionSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user_id.username', read_only=True)

    class Meta:
        model = ChildrenContribution
        fields = [
            'child_id', 'user_id', 'child_name', 'parent_name',
            'total_contribution_planned', 'monthly_contribution',
            'created_at', 'user_username'
        ]
        read_only_fields = ["child_id", "created_at", "user_username"]


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['milestone_id', 'title', 'description']
        extra_kwargs = {
            'milestone_id': {'read_only': True}
        }


class UserMilestoneSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user_id.username', read_only=True)
    milestone_title = serializers.CharField(source='milestone_id.title', read_only=True)
    milestone_details = MilestoneSerializer(source='milestone_id', read_only=True)

    class Meta:
        model = UserMilestone
        fields = [
            'umid', 'user_id', 'milestone_id', 'is_completed',
            'completed_at', 'user_username', 'milestone_title', 'milestone_details'
        ]
        extra_kwargs = {
            'umid': {'read_only': True}
        }


class UserResponseSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user_id.username', read_only=True)

    class Meta:
        model = UserResponse
        fields = [
            'response_id', 'user_id', 'salary_confirmed', 'emergency_savings',
            'emergency_savings_amount', 'has_debt', 'debt_amount',
            'retirement_investing', 'retirement_savings_amount',
            'has_children', 'children_count', 'bought_home',
            'pay_off_home', 'mortgage_remaining', 'submitted_at',
            'user_username'
        ]
        extra_kwargs = {
            'response_id': {'read_only': True},
            'submitted_at': {'read_only': True}
        }