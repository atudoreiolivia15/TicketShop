import React, { useState, useEffect } from 'react';
import ClientNavbar from './ClientNavbar';
import axios from 'axios';
import EventCard from './EventCard';
import { Container, Row, Col } from 'react-bootstrap';
import { getCSRFToken } from './Session';

function ClientDashboard() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const [cart, setCart] = useState([]);

    const [allEvents, setAllEvents] = useState([]); // Toate evenimentele
  
    useEffect(() => {
        const getEvents = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/events`, {
                    withCredentials: true
                });
                setAllEvents(response.data);
                setEvents(response.data);
                setError('');
            } catch (error) {
                setError('Failed to fetch events.');
                console.error(error);
            }
        };

        getEvents();
        
    }, []);

    const handleSearch = (searchTerm) => {
        if(!searchTerm){
            setEvents(allEvents);
        }
        else{
            const filtered = allEvents.filter(event =>
                event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase())
              );
              setEvents(filtered);
        }
       
      };
    

    const handleAddToCart = async (eventId) => {
        try {
            console.log("Event ID:", eventId);
    
            const csrfToken = getCSRFToken();
            const cartResponse = await axios.get(`http://127.0.0.1:8000/api/cart/add/${eventId}`, {
                withCredentials: true,
                headers: { 'X-CSRFToken': csrfToken }
            });
    
            if (cartResponse.data.tickets && cartResponse.data.tickets.length > 0) {
                setCart(prevCart => {
                    // obtine id ul biletelor deja selectate
                    const existingIds = new Set(prevCart.map(ticket => ticket.id));
    
                    // biletele care nu sunt deja in cos
                    const newTickets = cartResponse.data.tickets.filter(
                        ticket => !existingIds.has(ticket.id)
                    );
                    
                    return [...prevCart, ...newTickets];
                });

            
            } else {
                alert("No tickets available for this event.");
            }
        } catch (error) {
            console.error("Error adding tickets to cart:", error);
        }
    };
    useEffect(() => {
        if (cart && cart.length > 0) {
            setCartCount(prevCount => prevCount + 1);
        } 
        else{
            setCartCount(0);
        }
    }, [cart]);

    return (
        <div>
            <ClientNavbar onSearch={handleSearch} cartCount={cartCount} cart={cart} />
            <Container style={{ marginTop: '2rem' }}>
                <Row>
                    {events.map((event,index) => (
                        <Col key={event.id} sm={12} md={6} lg={4}>
                            <EventCard event={event} onPurchase={handleAddToCart} index={index} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

export default ClientDashboard;
