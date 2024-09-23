from django.urls import path
from .views import patient_list, patients_operate, assessments_operate, assessments_list, RegisterUserView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    
    path('register/', RegisterUserView.as_view(), name='register_user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('patient_list/', patient_list, name='patient_list'),
    path('patients/', patients_operate, name='patients_operate'),
    path('patients/<int:id>/', patients_operate, name='patients_operate'),
    
    path('assessments_list/', assessments_list, name='assessments_list'),
    path('assessments/', assessments_operate, name='assessments_operate'),
    path('assessments/<int:id>/', assessments_operate, name='assessments_operate'),
    
]