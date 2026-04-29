from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    get_doctors, register, logout, book_appointment,
    TimeSlotViewSet, add_doctor,
    my_appointments, cancel_appointment
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register('slots', TimeSlotViewSet, basename='slots')

urlpatterns = [
    path('doctors/', get_doctors),
    
    path('book/', book_appointment),

    path('my-appointments/', my_appointments),
    path('cancel/<int:id>/', cancel_appointment),

    path('register/', register),
    path('login/', TokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('logout/', logout),

    path('add-doctor/', add_doctor),

    path('', include(router.urls)),
]