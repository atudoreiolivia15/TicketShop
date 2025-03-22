from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    name = models.CharField(max_length=500)
    description = models.CharField(max_length=1500)
    date = models.DateTimeField("event date")
    location = models.CharField(max_length=100)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='event_images/', null=True, blank=True) 
    
    def __str__(self):
        return self.name

class Ticket(models.Model):
    ticket_type = models.CharField(max_length=10, null=True, blank=True)
    stock = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

class Order(models.Model):
    full_name = models.CharField(max_length=10, null=True, blank=True)
    total_price =  models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    street = models.CharField(max_length=10, null=True, blank=True)
    phone_number = models.CharField(max_length=10, null=True, blank=True)
        
    def __str__(self):
        return self.full_name

class Order_detail(models.Model):
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    ticket_id = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    quantity =  models.IntegerField()

class OrderSubject:
    def __init__(self):
        self._observers = [] 

    def attach(self, observer):
        self._observers.append(observer) 

    def notify(self, order):
        for observer in self._observers:
            observer.update(order)  

class OrderObserver:
    def update(self,order):
        total_orders = Order.objects.count()

        self.response_data = {
            'message': 'Thank you for your order!',
            'order_id': order.id,
            'total_orders': total_orders,
            'sum_price': order.total_price,
            'user_message': f'Felicitări, aceasta este comanda #{total_orders} !'
        }