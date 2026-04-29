import django_filters
from booking.models import TimeSlot

class SlotFilter(django_filters.FilterSet):

    doctor = django_filters.NumberFilter(field_name='doctor')

    specialization = django_filters.CharFilter(
        field_name='doctor__specialization',
        lookup_expr='icontains'
    )

    date = django_filters.DateFilter(field_name='date')

    start_time = django_filters.TimeFilter(field_name='time', lookup_expr='gte')
    end_time = django_filters.TimeFilter(field_name='time', lookup_expr='lte')

    class Meta:
        model = TimeSlot
        fields = ['doctor', 'specialization', 'date']