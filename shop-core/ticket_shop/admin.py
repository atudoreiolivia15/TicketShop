from django.contrib import admin

from .models import Event
from .models import Ticket
from .models import Order
from .models import Order_detail

admin.site.register(Event)
admin.site.register(Ticket)
admin.site.register(Order)
admin.site.register(Order_detail)