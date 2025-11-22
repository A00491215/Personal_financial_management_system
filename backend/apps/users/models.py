from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password


from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password


from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150)
    email = models.EmailField(unique=True)

    # Financial fields
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_balance = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    BUDGET_PREFERENCES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]
    budget_preference = models.CharField(max_length=10, choices=BUDGET_PREFERENCES, default='monthly')

    email_notification = models.BooleanField(default=False)

    # Required Django fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.username

class Category(models.Model):
    category_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Expense(models.Model):
    expense_date = models.DateField(primary_key=True)
    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='expenses'
    )
    category_id = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='expenses'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'expenses'
        unique_together = [['user_id', 'expense_date', 'category_id']]

    def __str__(self):
        return f"{self.user_id.username} - {self.category_id.name} - {self.expense_date}"


class ChildrenContribution(models.Model):
    child_id = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='children_contributions'
    )
    child_name = models.CharField(max_length=100)
    parent_name = models.CharField(max_length=100)
    total_contribution_planned = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    monthly_contribution = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'children_contributions'
        unique_together = [['user_id', 'child_id', 'child_name', 'parent_name']]

    def __str__(self):
        return f"{self.child_name} - {self.parent_name}"


class Milestone(models.Model):
    milestone_id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'milestones'

    def __str__(self):
        return self.title


class UserMilestone(models.Model):
    umid = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_milestones'
    )
    milestone_id = models.ForeignKey(
        Milestone,
        on_delete=models.CASCADE,
        related_name='user_milestones'
    )
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'user_milestones'
        unique_together = [['user_id', 'milestone_id']]

    def __str__(self):
        return f"{self.user_id.username} - {self.milestone_id.title}"


class UserResponse(models.Model):
    response_id = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_responses'
    )
    salary_confirmed = models.BooleanField(default=False)
    emergency_savings = models.BooleanField(default=False)
    emergency_savings_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    has_debt = models.BooleanField(default=False)
    debt_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    retirement_investing = models.BooleanField(default=False)
    retirement_savings_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    has_children = models.BooleanField(default=False)
    children_count = models.IntegerField(null=True, blank=True)
    bought_home = models.BooleanField(default=False)
    pay_off_home = models.BooleanField(default=False)
    mortgage_remaining = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_responses'
        unique_together = [['user_id', 'response_id']]

    def __str__(self):
        return f"{self.user_id.username} - Response {self.response_id}"