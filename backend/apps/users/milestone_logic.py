# backend/apps/users/milestone_logic.py
from decimal import Decimal
from django.db.models import Sum
from django.core.mail import send_mail
from django.conf import settings
from .models import User, UserMilestone, UserResponse, Category, Expense, ChildrenContribution, Milestone


# =====================================================================
#                       HELPER FUNCTIONS
# =====================================================================

def get_category_id(name: str):
    """Get category ID by name, return None if not exists"""
    try:
        return Category.objects.get(name__iexact=name).pk
    except Category.DoesNotExist:
        return None


def _get_sum_for_category(user: User, category_name: str) -> Decimal:
    """Helper: Sum of Expense.amount for a given user & category name."""
    try:
        category = Category.objects.get(name__iexact=category_name)
    except Category.DoesNotExist:
        return Decimal("0.00")

    agg = Expense.objects.filter(user_id=user, category_id=category).aggregate(
        total=Sum('amount')
    )
    return agg['total'] or Decimal("0.00")


# =====================================================================
#                       EMAIL NOTIFICATION
# =====================================================================

def send_milestone_email(user: User, completed_steps: list):
    """Send email notification about milestone progress"""
    if not user.email or not user.email_notification:
        return
    
    subject = "🎉 Your Dave Ramsey Milestone Progress Update"
    
    completed_text = '\n'.join([f"✔ {step}" for step in completed_steps]) if completed_steps else "Keep working on your goals!"
    
    body = f"""
Hello {user.username},

Here is your updated Baby Steps progress:

Completed:
{completed_text}

Keep going — you are making great progress towards financial freedom!

Regards,
Personal Finance App
    """
    
    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True
        )
    except Exception as e:
        print(f"Failed to send email: {e}")


# =====================================================================
#                   MILESTONE EVALUATION (For API)
# =====================================================================

def evaluate_milestones(user_id):
    """
    Evaluate and return the status of all 7 baby steps for a user.
    This is called by the API endpoint: /api/user-responses/milestones-status/?user_id=X
    Returns detailed information about each milestone for frontend display.
    """
    try:
        user = User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        return {'error': 'User not found'}

    # Get latest user response
    latest_response = UserResponse.objects.filter(user_id=user).order_by('-submitted_at').first()
    
    if not latest_response:
        return {
            'message': 'No financial data submitted yet. Please complete the Dave Ramsey form.',
            'milestones': []
        }

    salary = user.salary or Decimal("0.00")
    
    # Get expense sums for each category
    emergency_sum = _get_sum_for_category(user, "Emergency Savings")
    full_emergency_sum = _get_sum_for_category(user, "Full Emergency Savings")
    retirement_sum = _get_sum_for_category(user, "Retirement Investing")
    children_sum = _get_sum_for_category(user, "Children Contribution")
    mortgage_sum = _get_sum_for_category(user, "Home Mortgage")

    milestones_status = []

    # ---- Step 1: Starter Emergency Fund ($1,000) ----
    target_1 = Decimal("1000.00")
    step1_completed = latest_response.emergency_savings and emergency_sum >= target_1
    milestones_status.append({
        'step': 1,
        'title': 'Baby Step 1: Save $1,000 for a starter emergency fund',
        'completed': step1_completed,
        'current_amount': float(emergency_sum),
        'required_amount': float(target_1),
        'progress_percentage': min(float((emergency_sum / target_1) * 100), 100) if target_1 > 0 else 0,
        'message': f'${emergency_sum:,.2f} of ${target_1:,.2f} saved' if not step1_completed else 'Goal achieved! ✓'
    })

    # ---- Step 2: Debt Snowball ----
    step2_completed = not latest_response.has_debt
    debt_amount = latest_response.debt_amount or Decimal("0.00")
    milestones_status.append({
        'step': 2,
        'title': 'Baby Step 2: Pay off all debt (except the house) using the debt snowball',
        'completed': step2_completed,
        'debt_amount': float(debt_amount),
        'message': 'Debt-free! ✓' if step2_completed else f'${debt_amount:,.2f} debt remaining'
    })

    # ---- Step 3: Full Emergency Fund (6 months) ----
    target_3 = salary * Decimal("6")  # 6 months of salary
    step3_completed = full_emergency_sum >= target_3 if target_3 > 0 else False
    milestones_status.append({
        'step': 3,
        'title': 'Baby Step 3: Save 3–6 months of expenses in a fully funded emergency fund',
        'completed': step3_completed,
        'current_amount': float(full_emergency_sum),
        'required_amount': float(target_3),
        'progress_percentage': min(float((full_emergency_sum / target_3) * 100), 100) if target_3 > 0 else 0,
        'message': f'${full_emergency_sum:,.2f} of ${target_3:,.2f} saved (6 months)' if not step3_completed else 'Fully funded! ✓'
    })

    # ---- Step 4: Invest 15% for Retirement ----
    target_4 = salary * Decimal("0.15")  # 15% of annual salary
    step4_completed = latest_response.retirement_investing and retirement_sum >= target_4 if target_4 > 0 else False
    milestones_status.append({
        'step': 4,
        'title': 'Baby Step 4: Invest 15% of household income in retirement',
        'completed': step4_completed,
        'current_amount': float(retirement_sum),
        'required_amount': float(target_4),
        'progress_percentage': min(float((retirement_sum / target_4) * 100), 100) if target_4 > 0 else 0,
        'message': f'${retirement_sum:,.2f} of ${target_4:,.2f} invested' if not step4_completed else 'Retirement goal met! ✓'
    })

    # ---- Step 5: College Fund ----
    if not latest_response.has_children:
        step5_completed = True
        step5_message = 'No children - Step automatically complete ✓'
        planned_total = Decimal("0")
        progress_5 = 100
    else:
        # Get total planned contribution from ChildrenContribution model
        planned_total = ChildrenContribution.objects.filter(
            user_id=user
        ).aggregate(total=Sum('total_contribution_planned'))['total'] or Decimal("0.00")

        if planned_total == 0:
            # If no plan set, just check if any contributions exist
            step5_completed = children_sum > Decimal("0.00")
            step5_message = f'${children_sum:,.2f} contributed' if not step5_completed else 'Contributing to education! ✓'
            progress_5 = 0
        else:
            step5_completed = children_sum >= planned_total
            progress_5 = min(float((children_sum / planned_total) * 100), 100)
            step5_message = f'${children_sum:,.2f} of ${planned_total:,.2f} saved' if not step5_completed else 'Education goal met! ✓'

    milestones_status.append({
        'step': 5,
        'title': "Baby Step 5: Save for your children's college education",
        'completed': step5_completed,
        'current_amount': float(children_sum),
        'planned_amount': float(planned_total),
        'children_count': latest_response.children_count if latest_response.has_children else 0,
        'progress_percentage': progress_5,
        'message': step5_message
    })

    # ---- Step 6: Pay Off Home ----
    if not latest_response.bought_home:
        step6_completed = True
        step6_message = 'No home mortgage - Step automatically complete ✓'
        mortgage_remaining = Decimal("0")
        progress_6 = 100
    elif latest_response.pay_off_home:
        step6_completed = True
        step6_message = 'Home paid off! ✓'
        mortgage_remaining = Decimal("0")
        progress_6 = 100
    else:
        mortgage_remaining = latest_response.mortgage_remaining or Decimal("0.00")
        step6_completed = mortgage_sum >= mortgage_remaining if mortgage_remaining > 0 else False
        progress_6 = min(float((mortgage_sum / mortgage_remaining) * 100), 100) if mortgage_remaining > 0 else 0
        step6_message = f'${mortgage_sum:,.2f} paid of ${mortgage_remaining:,.2f} mortgage' if not step6_completed else 'Mortgage paid off! ✓'

    milestones_status.append({
        'step': 6,
        'title': 'Baby Step 6: Pay off your home early',
        'completed': step6_completed,
        'mortgage_remaining': float(mortgage_remaining),
        'amount_paid': float(mortgage_sum),
        'progress_percentage': progress_6,
        'message': step6_message
    })

    # ---- Step 7: Build Wealth & Give ----
    all_previous_complete = all(m['completed'] for m in milestones_status)
    milestones_status.append({
        'step': 7,
        'title': 'Baby Step 7: Build wealth and give generously',
        'completed': all_previous_complete,
        'message': 'All previous baby steps completed! 🎉' if all_previous_complete else 'Complete all previous steps first'
    })

    # Calculate overall progress
    completed_count = sum(1 for m in milestones_status if m['completed'])
    progress_percentage = (completed_count / 7) * 100

    # Get completed milestone names for potential email
    completed_steps = [m['title'] for m in milestones_status if m['completed']]

    return {
        'user_id': user.user_id,
        'username': user.username,
        'progress_percentage': round(progress_percentage, 1),
        'completed_steps': completed_count,
        'total_steps': 7,
        'milestones': milestones_status,
        'completed_milestone_titles': completed_steps  # For email
    }