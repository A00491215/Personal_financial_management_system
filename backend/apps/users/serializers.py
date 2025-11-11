# backend/apps/users/serializers.py
from rest_framework import serializers
from .models import User, Category, Expense, ChildrenContribution, Milestone, UserMilestone, UserResponse

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


class UserRegistrationSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'salary', 
                  'total_balance', 'budget_preference', 'email_notification']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords must match")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


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
        extra_kwargs = {
            'child_id': {'read_only': True},
            'created_at': {'read_only': True}
        }


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

    class Meta:
        model = UserMilestone
        fields = [
            'umid', 'user_id', 'milestone_id', 'is_completed',
            'completed_at', 'user_username', 'milestone_title'
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