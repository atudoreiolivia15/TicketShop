from django.contrib.auth import authenticate, login,logout
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist 
import traceback
from django.contrib.auth.models import User, Group
from .models import Event
from .models import Ticket
from .models import Order
from .models import Order_detail
from .models import OrderObserver
from .models import OrderSubject

def is_admin(user):
    return user.groups.filter(name='admin').exists()

def clear_old_sessions(user):
    sessions = Session.objects.filter(expire_date__gte=timezone.now())
    for session in sessions:
        data = session.get_decoded()
        if data.get('_auth_user_id') == str(user.id):
            session.delete()
#cand un user se logheaza, Django genereza utomat un sessionId, cre e automat salvat in browser ca si cookie
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        #clear_old_sessions(user)
        login(request, user)

        groups = user.groups.values_list('name', flat=True)
        group = groups[0] if groups else 'Client'

        return JsonResponse({
            'message': 'Login successful',
            'user': {
                'username': user.username,
                'group': group
            }
        }, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout_view(request):
    logout(request)#sterge sessionid din browser
    response = JsonResponse({'message': 'Logout successfully'}, status=status.HTTP_200_OK)

    response.delete_cookie('sessionid')

    return response
@api_view(['GET'])
def get_all_events(request):
    username = request.user

    try:
        user = User.objects.get(username=username)

        events = []

        if user.groups.filter(name='Administrator').exists():
            events = Event.objects.all()
        elif user.groups.filter(name='Event Owner').exists():
            events = Event.objects.filter(user=user)
        else:
            events = Event.objects.all()
        events_list = []
        for event in events:
            events_list.append({
                'id': event.id,
                'name': event.name,
                'description': event.description,
                'date': event.date,
                'location': event.location,
                'user': {
                    'id': event.user.id,
                    'username': event.user.username,
                    'email': event.user.email
                }
            })
        
        return JsonResponse(events_list, safe=False)  # safe=False allows a list to be returned

    except ObjectDoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
   


@api_view(['POST'])
def add_event(request):
    username = request.data.get('user')

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    event = Event(
        name=request.data.get('name'),
        description=request.data.get('description'),
        date=request.data.get('date'),
        location=request.data.get('location'),
        user=user
    )
    event.save()

    return JsonResponse({'message': 'Event created successfully'}, status=status.HTTP_200_OK)
    
@api_view(['POST'])
def update_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return JsonResponse({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    #in caz ca nu exista valoarea in request, o pune pe cea din db
    event.name = request.data.get('name', event.name)
    event.description = request.data.get('description', event.description)
    event.location = request.data.get('location', event.location)

    event.save()

    return JsonResponse({'message': 'Event updated successfully'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        print("Event " + event_id + " was not found")
        return JsonResponse({'message': 'Event deleted successfully'}, status=status.HTTP_200_OK)

    event.delete()

    return JsonResponse({'message': 'Event deleted successfully'}, status=status.HTTP_200_OK)


#TICKETS
@api_view(['GET'])
def get_all_tickets(request):
    username = request.user

    user = User.objects.get(username=username)

    if user.groups.filter(name='Event Owner').exists():
        tickets = Ticket.objects.filter(event__user=user) # verific daca creatorul evenimentului coincide cu cel al ticket ului
        valid_tickets = []
        for ticket in tickets:
            valid_tickets.append(ticket)
            
        tickets_list = []
        for ticket in valid_tickets:
            tickets_list.append({
                'id': ticket.id,
                'ticket_type': ticket.ticket_type,
                'stock': ticket.stock,
                'price': ticket.price,
                'event_id': ticket.event.id
            })

    else:
        return JsonResponse({'message': 'User does not have access to events'}, status=500)

    events = []

    if user.groups.filter(name='Administrator').exists():
        events = Event.objects.all()
    elif user.groups.filter(name='Event Owner').exists():
        events = Event.objects.filter(user=user)
    
    events_list = []
    for event in events:
        events_list.append({
            'id': event.id,
            'name': event.name,
            'description': event.description,
            'date': event.date,
            'location': event.location,
            'user': {
                'id': event.user.id,
                'username': event.user.username,
                'email': event.user.email
            }
        })

    return JsonResponse({'tickets': tickets_list, 'events': events_list}, status=200)


@api_view(['POST'])
def add_ticket(request):
    try:
        event_id = request.data.get('event_id')
        print("EVENT_ID--------------")
        print(event_id)
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return JsonResponse({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    ticket = Ticket(
        ticket_type=request.data.get('ticket_type'),
        stock=request.data.get('stock'),
        price = request.data.get('price'),
        event=event
    )
    ticket.save()

    return JsonResponse({'message': 'Ticket added successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def update_ticket(request, ticket_id):
    
    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        return JsonResponse({'error': 'Ticket not found'}, status=status.HTTP_404_NOT_FOUND)

    # actulizare  ticket_type și stock
    ticket.ticket_type = request.data.get('ticket_type', ticket.ticket_type)
    ticket.stock = request.data.get('stock', ticket.stock)
    ticket.price = request.data.get('price',ticket.price)

    # preluare ID-ul evenimentului din request si se cauta evenimentul
    event_id = request.data.get('event_id', "")
    if event_id:
        try:
            event = Event.objects.get(id=event_id)  # se gaseste evenimentul pe baza ID-ului
            ticket.event = event  # asociaza evenimentul cu ticketul
        except Event.DoesNotExist:
            return JsonResponse({'error': 'Event not found'}, status=status.HTTP_400_BAD_REQUEST)

    ticket.save()  

    return JsonResponse({'message': 'Ticket updated successfully'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_ticket(request, ticket_id):
    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        return JsonResponse({'message': 'ticket deleted successfully'}, status=status.HTTP_200_OK)

    ticket.delete()

    return JsonResponse({'message': 'ticket deleted successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def add_ticket_to_cart(request,event_id):
    print(event_id)
    try:
        tickets = Ticket.objects.filter(event_id = event_id)
        
        if not tickets:
            return  JsonResponse({'error': 'No tickets found for this event'}, status=404)

        ticket_data = []

        for ticket in tickets:
            ticket_data.append({
                'id': ticket.id,
                'ticket_type': ticket.ticket_type,
                'stock': ticket.stock,
                'price': ticket.price
            })    
        return JsonResponse({'tickets': ticket_data}, status=200)  
    except Exception as e:
        print(traceback.format_exc()) 
        return JsonResponse({'error': str(e)}, status=500)    

@api_view(['POST'])
def add_order(request):
    tickets_data = request.data.get('tickets')
    full_name = request.data.get('full_name')
    street = request.data.get('street')
    phone_number = request.data.get('phone_number')
    total_price = request.data.get('total_price')
    print(tickets_data)
    order = Order.objects.create(
        full_name = full_name,
        street= street,
        phone_number=phone_number,
        total_price=total_price
    )
    for ticket_data in tickets_data:
        ticket_id = ticket_data.get('id')
        quantity = ticket_data.get('quantity',1)

        try:
            ticket = Ticket.objects.get(id = ticket_id)
            if ticket.stock < quantity:
                    return JsonResponse({'error': f'Not enough stock for ticket {ticket_id}'}, status=status.HTTP_400_BAD_REQUEST)

            ticket.stock -= quantity
            ticket.save() 

        except Ticket.DoesNotExist:
            return JsonResponse({'error': f'Ticket with id {ticket_id} not found'}, status=status.HTTP_404_NOT_FOUND)
    
    order.save()
    
    for ticket_data in tickets_data:
        ticket_id = ticket_data.get('id')
        quantity = ticket_data.get('quantity',1)

        ticket = Ticket.objects.get(id=ticket_id)

        order_detail = Order_detail.objects.create(
            order_id = order,
            ticket_id = ticket,
            quantity = quantity,
        )
        order_detail.save()
        
    subject = OrderSubject()
    
    observer = OrderObserver()
    subject.attach(observer) 

    subject.notify(order)

    return JsonResponse(observer.response_data, status=status.HTTP_200_OK)        

@api_view(['POST'])
def add_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    email = request.data.get('email')
    user_type = request.data.get('user_type')
    groups = request.data.get('groups')  # List of group names
    print(f"Received data: {request.data}") 
    if not all([username, password, first_name, last_name, email]):
        return JsonResponse({'error': 'All fields are required!'}, status=status.HTTP_400_BAD_REQUEST)

    try:
       
        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email
        ) 
        user.set_password(password)
        groups = Group.objects.all()
        for group in groups:
   
            if(group.name == user_type):
                user.groups.add(group)
        user.save()

        return JsonResponse({'message': 'User created successfully!'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_all_users(request):

    try:
        users = User.objects.all()
        users_list = []
        for user in users:
            users_list.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'password' : '****',
                'user_type':  [group.name for group in user.groups.all()]
            })
        
        return JsonResponse(users_list, safe=False)  # safe=False allows a list to be returned

    except ObjectDoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

@api_view(['POST'])
def update_user(request, user_id):
    print(user_id)
    print("#####")
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


    user.username = request.data.get('username', user.username)
    user.email = request.data.get('email', user.email)
    user.first_name = request.data.get('first_name',user.first_name)
    user.last_name = request.data.get('last_name',user.last_name)
    password = request.data.get('password')
    if password:
        user.set_password(password)
    user_type = request.data.get('user_type')
    groups = Group.objects.all()
    for group in groups:
        if(group.name == user_type):
            user.groups.add(group)
    user.save()

    return JsonResponse({'message': 'User updated successfully'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'message': 'user deleted successfully'}, status=status.HTTP_200_OK)

    user.delete()

    return JsonResponse({'message': 'user deleted successfully'}, status=status.HTTP_200_OK)
