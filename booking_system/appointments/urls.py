from django.urls import path

# Explicit import prevents namespace collision
from . import views 

# BEST PRACTICE: App namespacing. 
# This prevents conflicts if you have multiple apps with a 'book/' URL.
app_name = 'appointments'

urlpatterns = [
    # Added 'name' parameters so you can use Django's reverse() or url tags in templates/serializers
    path('slots/', views.available_slots, name='available-slots'),
    
    path('book/', views.book_appointment, name='book-appointment'),
    
    # CRITICAL FIX: Changed <int:id> to <uuid:pk> to match the new UUID model.
    # We also use 'pk' (Primary Key) as it is the Django standard.
    path('cancel/<uuid:pk>/', views.cancel_appointment, name='cancel-appointment'),
]