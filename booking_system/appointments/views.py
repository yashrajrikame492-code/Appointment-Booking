from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
                            
# Explicit imports instead of *
from .models import TimeSlot, Appointment
from .serializers import TimeSlotSerializer, AppointmentSerializer


@api_view(['GET'])
def available_slots(request):


    slots = TimeSlot.objects.filter(
    is_booked=False,
    start_time__date="2026-04-10"
)
    """
    Returns a list of all upcoming, unbooked timeslots.
    """
    # 1. Using the Custom Manager: 
    # Instead of TimeSlot.objects.filter(is_booked=False) which might return 
    # slots from yesterday, we use the custom .available() manager we built in models.py.
    # This automatically filters out past dates and already booked slots.
    
    slots = TimeSlot.objects.available().select_related('provider__user')
    # Optimization: added select_related to prevent N+1 queries when the serializer 
    # looks up the provider_name.
    
    serializer = TimeSlotSerializer(slots, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_appointment(request):
    """
    Safely books an appointment using database row-locking.
    """
    timeslot_id = request.data.get('timeslot')

    if not timeslot_id:
        return Response({"error": "Timeslot ID is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            # select_for_update() prevents double-booking race conditions
            slot = TimeSlot.objects.select_for_update().get(id=timeslot_id)

            if slot.is_booked:
                return Response({"error": "This slot is already booked."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = AppointmentSerializer(data=request.data)
            
            if serializer.is_valid():
                slot.is_booked = True
                slot.save()
                
                # Assign the authenticated user automatically
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except TimeSlot.DoesNotExist:
        return Response({"error": "Invalid timeslot."}, status=status.HTTP_404_NOT_FOUND)
    


    send_mail(
        'Appointment Confirmed',
        'Your booking is successful',
        'from@example.com',
        [request.user.email],
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_appointment(request, pk): # Using 'pk' (Primary Key) is standard for UUIDs
    """
    Cancels an appointment and frees up the associated timeslot.
    """
    # 2. Authorization & Safe Fetching:
    # get_object_or_404 prevents the server from crashing if a bad ID is passed.
    # CRITICAL: We add `user=request.user` so a user can ONLY cancel their own appointments.
    appointment = get_object_or_404(Appointment, id=pk, user=request.user)

    # 3. Idempotency Check:
    # If they click cancel twice by accident, don't break anything.
    if appointment.status == 'CANCELLED':
        return Response({"error": "This appointment is already cancelled."}, status=status.HTTP_400_BAD_REQUEST)

    # 4. Transactional Integrity:
    # If updating the timeslot fails for some reason, the appointment won't be cancelled either.
    with transaction.atomic():
        appointment.status = 'CANCELLED'
        appointment.save()

        # Free up the timeslot
        appointment.timeslot.is_booked = False
        appointment.timeslot.save()

    return Response({"message": "Appointment cancelled successfully."}, status=status.HTTP_200_OK)











