from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

router = DefaultRouter()
router.register(r'batches', views.BatchViewSet)
router.register(r'students', views.StudentViewSet)

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('', include(router.urls)),
    
    path('attendance/', views.get_attendance, name='get_attendance'),
    path('attendance/bulk/', views.save_bulk_attendance, name='save_bulk_attendance'),
    
    path('dashboard/', views.dashboard_stats, name='dashboard_stats'),
    path('export/excel/', views.export_excel, name='export_excel'),
    path('report/batch/', views.batch_report, name='batch_report'),
]
