# backend/apps/users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, CategoryViewSet, ExpenseViewSet,
    ChildrenContributionViewSet, MilestoneViewSet,
    UserMilestoneViewSet, UserResponseViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'children-contributions', ChildrenContributionViewSet, basename='children-contribution')
router.register(r'milestones', MilestoneViewSet, basename='milestone')
router.register(r'user-milestones', UserMilestoneViewSet, basename='user-milestone')
router.register(r'user-responses', UserResponseViewSet, basename='user-response')

urlpatterns = [
    path('', include(router.urls)),
]