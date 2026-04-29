"""
URL configuration for booking_system project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # 1. The Admin Panel
    # Essential for accessing the optimized ServiceProvider and Appointment dashboards we built.
    path('admin/', admin.site.urls),

    # 2. API Versioning & App Routing
    # Notice we use 'api/v1/' instead of just 'api/'. 
    # This namespaces your app's URLs perfectly.
    path('api/v1/appointments/', include('appointments.urls')),

    # 3. DRF Browsable API Authentication (Development Aid)
    # Since we secured the booking endpoints with @permission_classes([IsAuthenticated]),
    # this allows you to log in directly through the Django REST Framework browser interface.
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]