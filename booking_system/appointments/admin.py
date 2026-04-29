from django.contrib import admin
from .models import ServiceProvider, TimeSlot, Appointment

@admin.register(ServiceProvider)
class ServiceProviderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'specialization')
    search_fields = ('user__username', 'user__email', 'specialization')
    list_filter = ('specialization',)

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ('id', 'provider', 'start_time', 'end_time', 'is_booked')
    list_filter = ('is_booked', 'start_time')
    search_fields = ('provider__user__username', 'provider__specialization')
    date_hierarchy = 'start_time'
    
    # Optimization: Prevents a massive dropdown menu if you have 10,000 providers.
    # Instead, it gives you a search box to find the provider.
    autocomplete_fields = ('provider',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    # We use custom methods (defined below) to show data from related models
    list_display = ('short_id', 'user', 'get_provider', 'get_start_time', 'status', 'created_at')
    
    list_filter = ('status', 'created_at')
    
    # Allows searching by the user's name or the provider's name
    search_fields = ('user__username', 'timeslot__provider__user__username')
    
    # UUIDs and creation dates shouldn't be editable
    readonly_fields = ('id', 'created_at')
    
    # CRITICAL OPTIMIZATION: Prevents the N+1 query problem.
    # Tells Django to fetch all this related data in a single SQL query
    # rather than hitting the database for every single row displayed.
    list_select_related = ('user', 'timeslot', 'timeslot__provider', 'timeslot__provider__user')

    # --- Custom Column Methods ---
    
    def short_id(self, obj):
        """Truncates the long UUID in the list view so it doesn't take up the whole screen."""
        return str(obj.id).split('-')[0]
    short_id.short_description = 'ID'

    def get_provider(self, obj):
        """Reaches across the OneToOne relationship to display the Provider's name."""
        return obj.timeslot.provider.user.username
    get_provider.short_description = 'Provider'
    # Allows you to click the column header to sort by Provider
    get_provider.admin_order_field = 'timeslot__provider__user__username' 

    def get_start_time(self, obj):
        """Displays the formatted start time of the related timeslot."""
        return obj.timeslot.start_time.strftime('%b %d, %H:%M')
    get_start_time.short_description = 'Time'
    get_start_time.admin_order_field = 'timeslot__start_time'