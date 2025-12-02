# backend/apps/users/services.py

from decimal import Decimal

from django.conf import settings
from django.core.mail import send_mail
from django.db.models import Sum
from django.utils import timezone

from .models import Expense, User

from .models import (
    User,
    Category,
    Expense,
    UserResponse,
    Milestone,
    UserMilestone,
)


BABY_STEP_TITLES = [
    "Baby Step 1: Save $1,000 for a starter emergency fund",
    "Baby Step 2: Pay off all debt (except the house) using the debt snowball",
    "Baby Step 3: Save 3–6 months of expenses in a fully funded emergency fund",
    "Baby Step 4: Invest 15% of household income in retirement",
    "Baby Step 5: Save for your children’s college education",
    "Baby Step 6: Pay off your home early",
    "Baby Step 7: Build wealth and give generously",
]


def _get_sum_for_category(user: User, category_name: str) -> Decimal:
    """
    Sum of Expense.amount for a given user & category name (case-insensitive).
    """
    try:
        category = Category.objects.get(name__iexact=category_name)
    except Category.DoesNotExist:
        return Decimal("0.00")

    agg = Expense.objects.filter(user_id=user, category_id=category).aggregate(
        total=Sum('amount')
    )
    return agg['total'] or Decimal("0.00")


def _ensure_milestones_exist():
    """
    Make sure the 7 Dave Ramsey milestones exist in the Milestone table.
    """
    for index, title in enumerate(BABY_STEP_TITLES, start=1):
        Milestone.objects.get_or_create(
            milestone_id=index,
            defaults={
                'title': title,
                'description': title,
            },
        )


def recalculate_baby_steps_and_email(user: User) -> None:
    """
    Core logic:
    - Read latest UserResponse (Dave Ramsey form)
    - Read Expense table categorized by:
        "Emergency savings"
        "Full Emergency savings"
        "Retirement Investing"
        "Children Contribution"
        "Home Mortgage"
    - Decide which of the 7 steps are completed.
    - Update UserMilestone rows.
    - Send an SMTP email summarizing status.
    """
    _ensure_milestones_exist()

    user_response = (
        UserResponse.objects.filter(user_id=user)
        .order_by('-submitted_at')
        .first()
    )

    # If no response yet, nothing to do
    if not user_response:
        return

    # Helper: salary as Decimal
    salary = user.salary or Decimal("0.00")

    # ---- Step 1: $1,000 Emergency fund ----
    emergency_sum = _get_sum_for_category(user, "Emergency savings")
    step1_completed = (
        user_response.emergency_savings and emergency_sum >= Decimal("1000.00")
    )

    # ---- Step 2: Debt Snowball (no non-mortgage debt) ----
    step2_completed = not user_response.has_debt

    # ---- Step 3: Full Emergency fund: 6 months of salary ----
    full_emergency_sum = _get_sum_for_category(user, "Full Emergency savings")
    target_full_fund = salary * Decimal("6")
    step3_completed = user_response.full_emergency_fund and full_emergency_sum >= target_full_fund

    # ---- Step 4: Invest 15% for retirement ----
    retirement_sum = _get_sum_for_category(user, "Retirement Investing")
    required_retirement = salary * Decimal("0.15")
    step4_completed = (
        user_response.retirement_investing and retirement_sum >= required_retirement
    )

    # ---- Step 5: Children education / "No Children Savings" ----
    # If has_children == False => automatically satisfied as "No Children Savings"
    if not user_response.has_children:
        step5_completed = True
        step5_note = "No children – education savings not required."
    else:
        children_sum = _get_sum_for_category(user, "Children Contribution")
        # Here we interpret "total_contribution_planned" as the target.
        # You may refine this using ChildrenContribution model if needed.
        step5_completed = children_sum > Decimal("0.00")
        step5_note = "Children savings in progress"

    # ---- Step 6: Pay off home mortgage ----
    # Interpret as: bought_home True AND pay_off_home True => satisfied.
    # Or if mortgage_remaining <= 0.
    if not user_response.bought_home:
        # If no home, treat step 6 as satisfied
        step6_completed = True
    else:
        if user_response.pay_off_home:
            step6_completed = True
        else:
            home_mortgage_sum = _get_sum_for_category(user, "Home Mortgage")
            remaining = user_response.mortgage_remaining or Decimal("0.00")
            step6_completed = home_mortgage_sum >= remaining

    # ---- Step 7: Build wealth & give generously ----
    # Simplified logic: if steps 1–6 all completed, mark step 7 as completed.
    step7_completed = all(
        [
            step1_completed,
            step2_completed,
            step3_completed,
            step4_completed,
            step5_completed,
            step6_completed,
        ]
    )

    completed_flags = [
        step1_completed,
        step2_completed,
        step3_completed,
        step4_completed,
        step5_completed,
        step6_completed,
        step7_completed,
    ]

    # ---- Update UserMilestone rows ----
    for index, completed in enumerate(completed_flags, start=1):
        milestone = Milestone.objects.get(milestone_id=index)
        um, _ = UserMilestone.objects.get_or_create(
            user_id=user,
            milestone_id=milestone,
        )

        if completed:
            if not um.is_completed:
                um.is_completed = True
                um.completed_at = timezone.now()
                um.save()
        else:
            if um.is_completed:
                # If progress regressed, mark incomplete.
                um.is_completed = False
                um.completed_at = None
                um.save()

    # ---- Email summary ----
    try:
        _send_milestone_email(user, completed_flags)
    except Exception:
        # Fail silently for now to avoid breaking API calls if email is misconfigured
        pass


def _send_milestone_email(user: User, completed_flags: list[bool]) -> None:
    """
    Send a simple SMTP email summarizing current milestone status.
    Requires EMAIL_* settings configured in Django settings.
    """
    if not getattr(settings, "EMAIL_HOST", None):
        # Email not configured
        return

    completed_lines = []
    for index, (title, completed) in enumerate(
        zip(BABY_STEP_TITLES, completed_flags),
        start=1,
    ):
        status = "COMPLETED ✅" if completed else "In progress ⏳"
        completed_lines.append(f"{index}. {title} — {status}")

    subject = "Your Dave Ramsey Baby Steps Milestone Update"
    body = (
        f"Hi {user.username},\n\n"
        "Here is your latest milestone status:\n\n"
        + "\n".join(completed_lines)
        + "\n\nKeep going – you're making progress!\n"
    )

    send_mail(
        subject=subject,
        message=body,
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
        recipient_list=[user.email],
        fail_silently=True,
    )


# --------------------#Email alert for daily expense#--------------------
def check_budget_and_send_alert(user: User):
    """
    Calculate current month's spending vs user's budget (salary),
    and send an email alert when usage reaches 75%, 90%, or 100%.
    Returns a dict with percentage and alert_level or None.
    """
    if not user or not user.email:
        return None

    # Assume salary is the monthly budget
    budget = user.salary or Decimal("0")
    if not budget or budget <= 0:
        return None

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

    percentage = int((total_spent / budget) * 100) if budget > 0 else 0

    alert_level = 0
    if percentage >= 100:
        alert_level = 100
    elif percentage >= 90:
        alert_level = 90
    elif percentage >= 75:
        alert_level = 75

    if alert_level == 0:
        return None

    # Simple email body – you can style later
    subject = f"Budget Alert: {percentage}% of your monthly budget used"
    message = (
        f"Hi {user.username},\n\n"
        f"You have spent {total_spent} out of your monthly budget {budget} "
        f"({percentage}% used).\n\n"
        f"Threshold {alert_level}% has been reached.\n"
        f"Please review your recent expenses in the Daily Expenses page.\n\n"
        f"- PFM System"
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=True,
    )

    return {
        "total_spent": total_spent,
        "budget": budget,
        "percentage": percentage,
        "alert_level": alert_level,
    }
    
# -----------------------------------------------------------------------#
def trigger_budget_alerts_for_user(user: User):
    """
    Recalculate this user's monthly budget usage and, if needed,
    send FR-7 budget alert emails at 75%, 90% and 100%.

    This is called after a new Expense is created.
    """
    # Get the latest monthly summary (total_spent, budget, percentage, alert_level)
    summary = calculate_monthly_summary(user)

    # Send an email only if a threshold (75/90/100) was crossed
    send_budget_alert_email(user, summary)

    # Optionally return the summary if callers want to use it
    return summary