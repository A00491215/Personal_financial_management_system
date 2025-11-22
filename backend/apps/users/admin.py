from django.contrib import admin
from .models import (
    User, Category, Expense, ChildrenContribution,
    Milestone, UserMilestone, UserResponse
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = [
        'user_id', 'username', 'email', 'salary', 'total_balance',
        'budget_preference', 'email_notification',
        'created_at', 'updated_at'
    ]
    list_filter = ['budget_preference', 'email_notification', 'created_at']
    search_fields = ['username', 'email']
    readonly_fields = ['user_id', 'created_at', 'updated_at', 'last_login']
    ordering = ['-created_at']

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Financial Information', {
            'fields': ('salary', 'total_balance', 'budget_preference')
        }),
        ('Notifications', {'fields': ('email_notification',)}),
        ('Important dates', {
            'fields': ('created_at', 'updated_at', 'last_login')
        }),
    )

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['category_id', 'name']
    search_fields = ['name']
    readonly_fields = ['category_id']


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = [
        'expense_date', 'user_id', 'category_id', 'amount', 'created_at'
    ]
    list_filter = ['category_id', 'created_at']
    search_fields = ['user_id__username', 'category_id__name']
    readonly_fields = ['created_at']
    date_hierarchy = 'expense_date'
    ordering = ['-expense_date']

    fieldsets = (
        ('User Information', {'fields': ('user_id',)}),
        ('Expense Details', {'fields': ('category_id', 'amount', 'expense_date')}),
        ('Metadata', {'fields': ('created_at',)}),
    )


@admin.register(ChildrenContribution)
class ChildrenContributionAdmin(admin.ModelAdmin):
    list_display = [
        'child_id', 'user_id', 'child_name', 'parent_name',
        'total_contribution_planned', 'monthly_contribution', 'created_at'
    ]
    list_filter = ['created_at']
    search_fields = ['child_name', 'parent_name', 'user_id__username']
    readonly_fields = ['child_id', 'created_at']
    ordering = ['-created_at']

    fieldsets = (
        ('User Information', {'fields': ('user_id',)}),
        ('Child Information', {'fields': ('child_name', 'parent_name')}),
        ('Contribution Details', {'fields': ('total_contribution_planned', 'monthly_contribution')}),
        ('Metadata', {'fields': ('created_at',)}),
    )


@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ['milestone_id', 'title', 'description']
    search_fields = ['title', 'description']
    readonly_fields = ['milestone_id']


@admin.register(UserMilestone)
class UserMilestoneAdmin(admin.ModelAdmin):
    list_display = [
        'umid', 'user_id', 'milestone_id', 'is_completed', 'completed_at'
    ]
    list_filter = ['is_completed', 'completed_at']
    search_fields = ['user_id__username', 'milestone_id__title']
    readonly_fields = ['umid']
    ordering = ['-completed_at']

    fieldsets = (
        ('Relationship', {'fields': ('user_id', 'milestone_id')}),
        ('Status', {'fields': ('is_completed', 'completed_at')}),
    )


@admin.register(UserResponse)
class UserResponseAdmin(admin.ModelAdmin):
    list_display = [
        'response_id', 'user_id', 'salary_confirmed', 'has_debt',
        'has_children', 'bought_home', 'submitted_at'
    ]
    list_filter = [
        'salary_confirmed', 'emergency_savings', 'has_debt',
        'retirement_investing', 'has_children', 'bought_home',
        'pay_off_home', 'submitted_at'
    ]
    search_fields = ['user_id__username']
    readonly_fields = ['response_id', 'submitted_at']
    ordering = ['-submitted_at']

    fieldsets = (
        ('User Information', {
            'fields': ('response_id', 'user_id', 'submitted_at')
        }),
        ('Salary & Emergency Savings', {
            'fields': (
                'salary_confirmed', 'emergency_savings',
                'emergency_savings_amount'
            )
        }),
        ('Debt Information', {
            'fields': ('has_debt', 'debt_amount')
        }),
        ('Retirement', {
            'fields': (
                'retirement_investing', 'retirement_savings_amount'
            )
        }),
        ('Children', {
            'fields': ('has_children', 'children_count')
        }),
        ('Home Ownership', {
            'fields': ('bought_home', 'pay_off_home', 'mortgage_remaining')
        }),
    )