from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.db import transaction

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend

from .models import Doctor, TimeSlot, Appointment
from .serializers import (
    DoctorSerializer,
    TimeSlotSerializer,
    AppointmentSerializer,
    RegisterSerializer
)
from booking.api.filters.slot_filter import SlotFilter
from rest_framework.permissions import AllowAny


# ✅ GET ALL DOCTORS
@api_view(['GET'])

@permission_classes([AllowAny])
def get_doctors(request):
    doctors = Doctor.objects.all()
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ REGISTER USER
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ LOGOUT USER (JWT BLACKLIST)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logged out"}, status=status.HTTP_200_OK)
    except Exception:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


# ✅ BOOK APPOINTMENT (FULL SAFE VERSION 🔥)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def book_appointment(request):
    slot_id = request.data.get('slot')
    doctor_id = request.data.get('doctor')

    # ✅ Validate input
    if not slot_id or not doctor_id:
        return Response(
            {"error": "Slot and Doctor IDs are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    with transaction.atomic():

        # 🔒 Lock slot row (prevents double booking)
        slot = get_object_or_404(
            TimeSlot.objects.select_for_update(),
            id=slot_id
        )

        # ✅ Validate doctor
        doctor = get_object_or_404(Doctor, id=doctor_id)

        # ❌ Check if already booked
        if slot.is_booked:
            return Response(
                {"error": "Slot already booked"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ❌ Extra safety check
        if Appointment.objects.filter(slot=slot).exists():
            return Response(
                {"error": "Slot already booked"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Mark slot booked
        slot.is_booked = True
        slot.save()

        # ✅ Create appointment
        appointment = Appointment.objects.create(
            user=request.user,
            doctor=doctor,
            slot=slot
        )

    # ✅ Send email (outside transaction)
    try:
        send_mail(
            'Appointment Confirmed',
            'Your booking is successful',
            'your_email@gmail.com',
            [request.user.email],
            fail_silently=True,
        )
    except Exception as e:
        print("Email error:", e)

    return Response(
        AppointmentSerializer(appointment).data,
        status=status.HTTP_201_CREATED
    )


# ✅ GET MY APPOINTMENTS (USER DASHBOARD 🔥)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_appointments(request):
    appointments = Appointment.objects.filter(user=request.user).order_by('-id')
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ CANCEL APPOINTMENT (VERY IMPORTANT 🔥)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_appointment(request, id):

    appointment = get_object_or_404(
        Appointment,
        id=id,
        user=request.user  # 🔐 only user can cancel their own
    )

    # ✅ Free the slot again
    slot = appointment.slot
    slot.is_booked = False
    slot.save()

    # ❌ Delete appointment (or you can use status field)
    appointment.delete()

    return Response(
        {"message": "Appointment cancelled successfully"},
        status=status.HTTP_200_OK
    )


# ✅ TIMESLOT VIEWSET (FILTER + SORT + READ ONLY 🔥)
class TimeSlotViewSet(ReadOnlyModelViewSet):
    serializer_class = TimeSlotSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = SlotFilter

    def get_queryset(self):
        return TimeSlot.objects.filter(is_booked=False).order_by('date', 'time')


# ✅ ADD DOCTOR (ADMIN ONLY)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_doctor(request):
    serializer = DoctorSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {
                "message": "Doctor added successfully!",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)