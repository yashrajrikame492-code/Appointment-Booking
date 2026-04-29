from django.db import models

# Create your models here.
from django.contrib.auth.models import User

class Doctor (models.Model):
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    

class TimeSlot (models.Model):
    doctor = models.ForeignKey(Doctor,on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.doctor.name} - {self.date} {self.time}"

class Appointment (models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor,on_delete=models.CASCADE)
    slot = models.ForeignKey(TimeSlot,on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default="Booked")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.doctor.name}"



class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15)
    address = models.TextField()

    def __str__(self):
        return self.user.username

