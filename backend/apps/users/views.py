# backend/apps/users/views.py

from decimal import Decimal

from datetime import date, timedelta


from django.db.models import Sum
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.permissions import IsAuthenticated

from .models import (
    User,
    Category,
    Expense,
    ChildrenContribution,
    Milestone,
    UserMilestone,
    UserResponse,
)

from .serializers import (
    UserSerializer,
    LoginSerializer,
    CategorySerializer,
    ExpenseSerializer,
    ChildrenContributionSerializer,
    MilestoneSerializer,
    UserMilestoneSerializer,
    UserResponseSerializer,
    JWTLoginSerializer,
)

from .services import recalculate_baby_steps_and_email
from .services import check_budget_and_send_alert
from .milestone_logic import evaluate_milestones
from drf_spectacular.utils import extend_schema, OpenApiParameter


# =====================================================================
#                           USER VIEWSET
# =====================================================================

class UserViewSet(viewsets.ModelViewSet):
    """
    Handles:
    - /api/users/register/
    - /api/users/login/
    - /api/users/<id>/ (GET / PATCH)
    """
    queryset = User.objects.all().order_by("user_id")
    serializer_class = UserSerializer

    # ------------------------- REGISTER -------------------------

    @action(detail=False, methods=["post"], permission_classes=[AllowAny], url_path="register")
    def register(self, request):
        """
        Create a new user and return JWT tokens.
        """
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        # Generate JWT token for the newly registered user
        # DON'T use RefreshToken.for_user() - create manually
        refresh = RefreshToken()
        refresh["user_id"] = user.user_id
        refresh["email"] = user.email
        
        access = refresh.access_token
        access["user_id"] = user.user_id
        access["email"] = user.email

        return Response(
            {
                "user": UserSerializer(user).data,
                "refresh": str(refresh),
                "access": str(access),
            },
            status=status.HTTP_201_CREATED,
        )

    # --------------------------- LOGIN --------------------------
    
    @action(detail=False, methods=["post"], permission_classes=[AllowAny], url_path="login")
    def login(self, request):
        """
        Authenticate user with JWT tokens.
        """
        serializer = JWTLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    # --------------------------- Dasshboard --------------------------
    @action(
        detail=False,
        methods=["get"],
        url_path="dashboard",
        permission_classes=[IsAuthenticated],
    )
    def dashboard(self, request):
        """
        Return very basic dashboard numbers for the logged-in user.
        """
        user = request.user  # this is your custom User model instance

        # Use Decimal defaults in case fields are null
        total_balance = user.total_balance or Decimal("0")
        monthly_income = user.salary or Decimal("0")
        
        # ---- current month date range ----
        today = timezone.now().date()
        start_of_month = today.replace(day=1)

        # simple "next month" calculation
        if start_of_month.month == 12:
            next_month = start_of_month.replace(
                year=start_of_month.year + 1,
                month=1
            )
        else:
            next_month = start_of_month.replace(month=start_of_month.month + 1)
            
            # ---- recent expenses (last 5) ----
        recent_expenses_qs = (
            Expense.objects.filter(user_id=user)
            .select_related("category_id")
            .order_by("-expense_date")[:5]
        )
        recent_expenses = ExpenseSerializer(recent_expenses_qs, many=True).data

        # ---- sum this month's expenses ----
        monthly_expenses = (
            Expense.objects.filter(
                user_id=user,
                expense_date__gte=start_of_month,
                expense_date__lt=next_month,
            ).aggregate(total=Sum("amount"))["total"]
            or Decimal("0")
        )
        
        # ---- savings rate (% of income not spent) ----
        if monthly_income > 0:
            savings_rate = float(
                (monthly_income - monthly_expenses) / monthly_income * 100
            )
        else:
            savings_rate = 0.0
            
        # ---- milestone / baby steps status ----
        milestone_status = evaluate_milestones(user.user_id)

        data = {
            "total_balance": str(total_balance),
            "monthly_income": str(monthly_income),
             "monthly_expenses": str(monthly_expenses),
             "savings_rate": round(savings_rate, 2),
             "recent_expenses": recent_expenses,
             "milestone_status": milestone_status,
        }
        return Response(data)
    
       
# =====================================================================
#                       CATEGORY VIEWSET
# =====================================================================

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer


# =====================================================================
#                       EXPENSE VIEWSET
# =====================================================================

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        """
        Daily expenses will use this. We filter optionally by ?user_id=
        and order newest expenses first.
        """
        qs = Expense.objects.all().select_related("user_id", "category_id")
        qs = qs.order_by("-expense_date", "-created_at")

        user_id = self.request.query_params.get("user_id")
        if user_id:
            qs = qs.filter(user_id=user_id)

        return qs

    def perform_create(self, serializer):
        """
        When a new expense is created, also check budget and send alerts.
        """
        expense = serializer.save()
        # Trigger budget/overspend alert email (FR-7)
        check_budget_and_send_alert(expense.user_id)

    @action(detail=False, methods=["get"], url_path="monthly-summary")
    def monthly_summary(self, request):
        """
        Returns this month's spending vs budget for the authenticated user.
        Used by the Daily Expenses page to show 75/90/100% alerts visually.
        """
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        today = timezone.now().date()
        first_day = today.replace(day=1)

        total_spent = (
            Expense.objects.filter(
                user_id=user,
                expense_date__gte=first_day,
                expense_date__lte=today,
            ).aggregate(total=Sum("amount"))["total"]
            or Decimal("0")
        )

        budget = user.salary or Decimal("0")
        percentage = int((total_spent / budget) * 100) if budget > 0 else 0

        alert_level = 0
        if percentage >= 100:
            alert_level = 100
        elif percentage >= 90:
            alert_level = 90
        elif percentage >= 75:
            alert_level = 75

        data = {
            "total_spent": str(total_spent),
            "budget": str(budget),
            "percentage": percentage,
            "alert_level": alert_level,
        }
        return Response(data, status=status.HTTP_200_OK)


# =====================================================================
#               CHILDREN CONTRIBUTIONS VIEWSET
# =====================================================================
@extend_schema(
    parameters=[
        OpenApiParameter(
            name="user_id",
            type=int,
            location=OpenApiParameter.QUERY,
            required=False,
            description="Filter children by user"
        )
    ]
)

class ChildrenContributionViewSet(viewsets.ModelViewSet):
    serializer_class = ChildrenContributionSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get("user_id")
        qs = ChildrenContribution.objects.all()

        if user_id:
            qs = qs.filter(user_id=user_id)

        return qs

# =====================================================================
#                        MILESTONE VIEWSETS
# =====================================================================

class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all().order_by("milestone_id")
    serializer_class = MilestoneSerializer


class UserMilestoneViewSet(viewsets.ModelViewSet):
    queryset = UserMilestone.objects.all().select_related("user_id", "milestone_id")
    serializer_class = UserMilestoneSerializer


# =====================================================================
#                       USER RESPONSE VIEWSET
# =====================================================================

class UserResponseViewSet(viewsets.ModelViewSet):
    queryset = UserResponse.objects.all().select_related("user_id")
    serializer_class = UserResponseSerializer

    # Check milestone progress
    @action(detail=False, methods=["get"], url_path="milestones-status")
    def milestone_status(self, request):
        user_id = request.query_params.get("user_id")
        data = evaluate_milestones(user_id)
        return Response(data)

    # When user submits Dave Ramsey form
    def perform_create(self, serializer):
        instance = serializer.save()
        recalculate_baby_steps_and_email(instance.user_id)

    # When the user updates the finance form
    def perform_update(self, serializer):
        instance = serializer.save()
        recalculate_baby_steps_and_email(instance.user_id)
