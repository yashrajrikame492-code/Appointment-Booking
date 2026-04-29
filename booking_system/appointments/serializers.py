from rest_framework import serializers
from .models import ServiceProvider, TimeSlot, Appointment

class TimeSlotSerializer(serializers.ModelSerializer):
    # 1. Custom Read-Only Fields
    # Instead of just returning "provider: 1", this traverses the relationships
    # to give the frontend the actual name and specialization.
    provider_name = serializers.CharField(source='provider.user.username', read_only=True)
    specialization = serializers.CharField(source='provider.specialization', read_only=True)

    class Meta:
        model = TimeSlot
        # 2. Explicit Field Declaration
        fields = [
            'id', 
            'provider', 
            'provider_name', 
            'specialization', 
            'start_time', 
            'end_time', 
            'is_booked'
        ]
        # 3. Security: Prevent users from arbitrarily changing the booked status
        read_only_fields = ['is_booked']


class AppointmentSerializer(serializers.ModelSerializer):
    # Reaching across the OneToOne relationship to get useful data for the frontend
    provider_name = serializers.CharField(source='timeslot.provider.user.username', read_only=True)
    start_time = serializers.DateTimeField(source='timeslot.start_time', read_only=True)
    client_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 
            'user', 
            'client_name', 
            'timeslot', 
            'provider_name', 
            'start_time', 
            'status', 
            'created_at'
        ]
        # Security: These fields should be set by the server/business logic, 
        # not injected by a malicious user in a POST request.
        read_only_fields = ['id', 'created_at', 'status', 'user']

    # 4. Object-Level Validation
    def validate_timeslot(self, value):
        """
        Validates the specific field 'timeslot' before saving.
        Prevents race conditions where two users try to book the same slot.
        """
        if value.is_booked:
            raise serializers.ValidationError("This timeslot is already booked and cannot be selected.")
        return value