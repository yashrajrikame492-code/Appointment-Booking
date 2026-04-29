from django.contrib import admin

# Register your models here.
from .models import Doctor,TimeSlot,Appointment,Profile

admin.site.register(Doctor)
admin.site.register(TimeSlot)
admin.site.register(Appointment)

admin.site.register(Profile)

