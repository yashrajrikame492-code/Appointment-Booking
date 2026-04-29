import uuid
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone

# 1. Custom Manager
class TimeSlotManager(models.Manager):
    def available(self):
        """Custom queryset to quickly find future, unbooked timeslots."""
        return self.filter(is_booked=False, start_time__gt=timezone.now())

class ServiceProvider(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='service_profile')
    specialization = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username

class TimeSlot(models.Model):
    provider = models.ForeignKey(ServiceProvider, on_delete=models.CASCADE, related_name='timeslots')
    # 2. Database Index added to start_time
    start_time = models.DateTimeField(db_index=True) 
    end_time = models.DateTimeField()
    is_booked = models.BooleanField(default=False)

    # Attach the custom manager
    objects = TimeSlotManager() 

    # 3. Model Level Validation
    def clean(self):
        if self.start_time and self.end_time and self.start_time >= self.end_time:
            raise ValidationError("End time must be strictly after start time.")

    def __str__(self):
        return f"{self.provider.user.username} - {self.start_time.strftime('%b %d, %H:%M')}"

class Appointment(models.Model):
    # 4. UUID Primary Key for security
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    timeslot = models.OneToOneField(TimeSlot, on_delete=models.CASCADE, related_name='appointment')
    
    STATUS_CHOICES = [
        ('BOOKED', 'Booked'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    # Database index added to status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='BOOKED', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Appt: {self.user.username} -> {self.timeslot.provider} at {self.timeslot.start_time.strftime('%H:%M')}"