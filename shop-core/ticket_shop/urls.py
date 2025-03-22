from django.urls import path
from . import views

urlpatterns = [
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('events', views.get_all_events, name='get_all_events'),
    path('events/add', views.add_event, name='add_event'),
    path('events/update/<int:event_id>', views.update_event, name='update_event'),
    path('events/delete/<int:event_id>', views.delete_event, name='delete_event'),

    path('users', views.get_all_users,name='get_all_users'),
    path('users/add', views.add_user, name='add_user'),
    path('users/update/<int:user_id>', views.update_user, name='update_user'),
    path('users/delete/<int:user_id>', views.delete_user, name='delete_user'),


    path('tickets', views.get_all_tickets, name='get_all_tickets'),
    path('tickets/add', views.add_ticket, name='add_ticket'),
    path('tickets/update/<int:ticket_id>', views.update_ticket, name='update_ticket'),
    path('tickets/delete/<int:ticket_id>', views.delete_ticket, name='delete_ticket'),
    path('cart/add/<int:event_id>', views.add_ticket_to_cart, name='add_ticket_to_cart'),
    path('orders/add', views.add_order, name='add_order'),
    

   ]
