# backend/apps/users/migrations/0001_initial.py

from django.db import migrations, models
import django.db.models.deletion
from django.contrib.auth.hashers import make_password


# ----------------------------
# Seed Initial Users
# ----------------------------
def create_initial_users(apps, schema_editor):
    User = apps.get_model('users', 'User')
    User.objects.create(
        username='admin',
        email='admin@gmail.com',
        password=make_password('admin123'),
        salary=100000.00,
        total_balance=50000.00,
        budget_preference='monthly',
        email_notification=True,
        is_staff=True,
        is_superuser=True,
    )
    User.objects.create(
        username='user1',
        email='user1@gmail.com',
        password=make_password('password123'),
        salary=75000.00,
        total_balance=25000.00,
        budget_preference='weekly',
        email_notification=True,
    )


# ----------------------------
# Seed Initial Categories
# ----------------------------
def create_categories(apps, schema_editor):
    Category = apps.get_model('users', 'Category')
    categories = [
        "Emergency Savings",
        "Full Emergency Savings",
        "Retirement Investing",
        "Children Contribution",
        "Home Mortgage"
    ]
    for name in categories:
        Category.objects.create(name=name)


class Migration(migrations.Migration):

    initial = True
    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),  # Required for groups/permissions
    ]

    operations = [

        # ------------------------------------------------------
        # USERS TABLE (CUSTOM USER MODEL)
        # ------------------------------------------------------
        migrations.CreateModel(
            name='User',
            fields=[
                ('user_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=150, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=128)),

                ('salary', models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)),
                ('total_balance', models.DecimalField(max_digits=12, decimal_places=2, default=0.00)),

                ('budget_preference', models.CharField(
                    max_length=20,
                    choices=[
                        ('daily', 'Daily'),
                        ('weekly', 'Weekly'),
                        ('monthly', 'Monthly'),
                        ('yearly', 'Yearly'),
                    ],
                    default='monthly'
                )),

                ('email_notification', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('last_login', models.DateTimeField(null=True, blank=True)),

                # ⭐ REQUIRED BY DJANGO AUTH ⭐
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
            ],
            options={'db_table': 'users'},
        ),

        # ------------------------------------------------------
        # MANY-TO-MANY FIELDS (FROM PermissionsMixin)
        # ------------------------------------------------------
        migrations.AddField(
            model_name='user',
            name='groups',
            field=models.ManyToManyField(
                related_name='user_set',
                related_query_name='user',
                to='auth.group',
                blank=True
            ),
        ),
        migrations.AddField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(
                related_name='user_set',
                related_query_name='user',
                to='auth.permission',
                blank=True
            ),
        ),

        # ------------------------------------------------------
        # CATEGORY TABLE
        # ------------------------------------------------------
        migrations.CreateModel(
            name='Category',
            fields=[
                ('category_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
            options={'db_table': 'category'},
        ),

        # ------------------------------------------------------
        # EXPENSE TABLE
        # ------------------------------------------------------
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('expense_date', models.DateField(primary_key=True, serialize=False)),
                ('amount', models.DecimalField(max_digits=10, decimal_places=2)),
                ('created_at', models.DateTimeField(auto_now_add=True)),

                ('user_id', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to='users.user',
                    related_name='expenses'
                )),
                ('category_id', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to='users.category',
                    related_name='expenses'
                )),
            ],
            options={
                'db_table': 'expenses',
                'unique_together': {('user_id', 'expense_date', 'category_id')},
            },
        ),

        # ------------------------------------------------------
        # CHILDREN CONTRIBUTION TABLE
        # ------------------------------------------------------
        migrations.CreateModel(
            name='ChildrenContribution',
            fields=[
                ('child_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('child_name', models.CharField(max_length=100)),
                ('parent_name', models.CharField(max_length=100)),
                ('total_contribution_planned', models.DecimalField(
                    max_digits=12, decimal_places=2, null=True, blank=True
                )),
                ('has_total_contribution', models.BooleanField(default=False)),
                ('monthly_contribution', models.DecimalField(
                    max_digits=10, decimal_places=2, null=True, blank=True
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),

                ('user_id', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to='users.user',
                    related_name='children_contributions'
                )),
            ],
            options={
                'db_table': 'children_contributions',
                'unique_together': {('user_id', 'child_id', 'child_name', 'parent_name')},
            },
        ),

        # ------------------------------------------------------
        # MILESTONE TABLE
        # ------------------------------------------------------
        migrations.CreateModel(
            name='Milestone',
            fields=[
                ('milestone_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True, null=True)),
            ],
            options={'db_table': 'milestones'},
        ),

        # ------------------------------------------------------
        # USER MILESTONES
        # ------------------------------------------------------
        migrations.CreateModel(
            name='UserMilestone',
            fields=[
                ('umid', models.BigAutoField(primary_key=True, serialize=False)),
                ('is_completed', models.BooleanField(default=False)),
                ('completed_at', models.DateTimeField(null=True, blank=True)),

                ('user_id', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to='users.user',
                    related_name='user_milestones'
                )),
                ('milestone_id', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to='users.milestone',
                    related_name='user_milestones'
                )),
            ],
            options={
                'db_table': 'user_milestones',
                'unique_together': {('user_id', 'milestone_id')},
            },
        ),

        # ------------------------------------------------------
        # USER RESPONSE TABLE
        # ------------------------------------------------------
        migrations.CreateModel(
            name='UserResponse',
            fields=[
                ('response_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('salary_confirmed', models.BooleanField(default=False)),
                ('emergency_savings', models.BooleanField(default=False)),
                ('emergency_savings_amount', models.DecimalField(
                    max_digits=12, decimal_places=2, null=True, blank=True
                )),
                ('has_debt', models.BooleanField(default=False)),
                ('debt_amount', models.DecimalField(
                    max_digits=12, decimal_places=2, null=True, blank=True
                )),
                ('full_emergency_fund', models.BooleanField(default=False)),
                ('full_emergency_fund_amount', models.DecimalField(
                    max_digits=12, decimal_places=2, null=True, blank=True
                )),
                ('retirement_investing', models.BooleanField(default=False)),
                ('retirement_savings_amount', models.DecimalField(
                    max_digits=12, decimal_places=2, null=True, blank=True
                )),
                ('has_children', models.BooleanField(default=False)),
                ('children_count', models.IntegerField(null=True, blank=True)),
                ('bought_home', models.BooleanField(default=False)),
                ('pay_off_home', models.BooleanField(default=False)),
                ('mortgage_remaining', models.DecimalField(
                    max_digits=12, decimal_places=2, null=True, blank=True
                )),
                ('submitted_at', models.DateTimeField(auto_now_add=True)),

                ('user_id', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to='users.user',
                    related_name='user_responses'
                )),
            ],
            options={
                'db_table': 'user_responses',
                'unique_together': {('user_id', 'response_id')},
            },
        ),

        # ------------------------------------------------------
        # SEED DATA
        # ------------------------------------------------------
        migrations.RunPython(create_initial_users),
        migrations.RunPython(create_categories),
    ]
