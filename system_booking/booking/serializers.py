from rest_framework import serializers
from .models import Doctor, TimeSlot, Appointment
from django.contrib.auth.models import User

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['id', 'doctor', 'date', 'time', 'is_booked']

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source="doctor.name", read_only=True)
    slot_time = serializers.CharField(source="slot.time", read_only=True)
    slot_date = serializers.CharField(source="slot.date", read_only=True)
    class Meta:
        model = Appointment
        fields = '__all__'  
        read_only_fields = ['user']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ['username','password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user