import React from "react";
import { Container, Table, Button, Row, Col ,Form  } from "react-bootstrap";
import ClientNavbar from "./ClientNavbar";
import axios from "axios";
import { getCSRFToken } from './Session';
import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import OrderCard from './OrderCard';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showOrderCard, setShowOrderCard] = useState(false);
    const [message, setMessage] = useState('');
    const [orderId, setOrderId] = useState(null);
    const [total_orders, setTotalOrders] = useState(0);
    const [sum_price,setSumPrice] = useState(0);

    const location = useLocation();  //   pentru a obtine acces la state-ul transmis
    const [deliveryAddress, setDeliveryAddress] = useState({
        full_name: '',
        street: '',
        phone_number: '',
    });

    useEffect(() => {
        const tickets = location.state?.cart || [];
        
        if (tickets && tickets.length > 0) {
            // Extind fiecare bilet pentru a include quantity și selected
            const updatedTickets = tickets.map(ticket => ({
                ...ticket,           // pastreaza datele existente
                quantity: 0         // set quantity implicit la 0
            }));
            setCartItems(updatedTickets);
            localStorage.setItem("cart", JSON.stringify(updatedTickets)); 
        }else {
            const savedCart = localStorage.getItem("cart");
            if (savedCart) {
                setCartItems(JSON.parse(savedCart)); // Restaurează din localStorage
            }
        }
    }, [location.state]);



    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setDeliveryAddress({ ...deliveryAddress, [name]: value });
    };

    const handleConfirmPayment = async () => {
        
        // toate campurile trebuie completate 
        if (!deliveryAddress.full_name || !deliveryAddress.street || !deliveryAddress.phone_number) {
            alert("Please fill in all delivery address fields.");
            return;
        }
        const orderData = {
            full_name: deliveryAddress.full_name,
            street: deliveryAddress.street,
            phone_number: deliveryAddress.phone_number,
            total_price: totalPrice,
            tickets: cartItems
            .filter(ticket => ticket.quantity > 0) 
            .map(ticket => ({
                id: ticket.id,
                quantity: ticket.quantity, 
            })),
        };
        

        try {
            const csrfToken = getCSRFToken();
            const response = await axios.post(`http://127.0.0.1:8000/api/orders/add`, orderData, {
                withCredentials: true,
                headers: {'X-CSRFToken': csrfToken}
        });
        if (response.status === 200) {
            const { message, order_id, total_orders,sum_price } = response.data;
            setMessage(message); 
            setOrderId(order_id); 
            setTotalOrders(total_orders);  
            setSumPrice(sum_price);
            console.log("Total Price in handleConfirmPayment: ", totalPrice);

            setShowOrderCard(true);
        }

        // Goleste cosul din localStorage
        localStorage.removeItem("cart");

        // Goleste cosul
        setCartItems([]);
        } catch (error) {
            console.error("Error placing order", error);
            alert("Failed to place order. Please try again.");
        }
    };

    const handleQuantityChange = (ticketId, change) => {
        setCartItems(prevItems =>
            prevItems.map(ticket => {
                if (ticket.id === ticketId) {
                    const newQuantity = Math.max(0, ticket.quantity + change); // Previne cantitățile sub 1
                    const availableQuantity = ticket.stock;
                    if (newQuantity <= availableQuantity) {
                        return { ...ticket, quantity: newQuantity };
                    } else {
                        alert(`Nu mai sunt suficiente bilete disponibile. Maximul este ${availableQuantity}.`);
                        return ticket;
                    }
                }
                return ticket;
            })
        );
    };
    useEffect(() => {
        const newTotalPrice = cartItems.reduce((total, ticket) => {
            return total + (ticket.price * ticket.quantity); 
        }, 0);

        setTotalPrice(newTotalPrice); 
    }, [cartItems]); 

    return (
        <div>
            <ClientNavbar />
            <Container style={{ marginTop: '2rem' }}>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                      <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Ticket Type</th>
                                    <th>Price (Lei)</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((ticket) => (
                                    <tr key={ticket.id}>
                                        
                                        <td>{ticket.ticket_type}</td>
                                        <td>{ticket.price}</td>
                                        <td>
                                            <div style ={{display: "flex", alignItems: "center"}}>
                                                <Button 
                                                    variant = "outline-secondary"
                                                    size = "sm"
                                                    onClick = {()=>handleQuantityChange(ticket.id,-1)}
                                                >
                                                    -
                                                </Button>
                                                <span style={{ margin: "0 10px" }}>{ticket.quantity}</span>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => handleQuantityChange(ticket.id, 1)}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                            <Row className="mt-3">
                                <Col>
                                    <h5>Delivery Address</h5>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="full_name"
                                                value={deliveryAddress.full_name}
                                                onChange={handleAddressChange}
                                                placeholder="Enter your full name"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Street Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="street"
                                                value={deliveryAddress.street}
                                                onChange={handleAddressChange}
                                                placeholder="Enter your street address"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Numar de telefon</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phone_number"
                                                value={deliveryAddress.phone_number}
                                                onChange={handleAddressChange}
                                                placeholder="Enter your phone number"
                                            />
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                        <Row className="mt-4">
                            <Col>
                                <h4>Total Price: {totalPrice} Lei  
                                <Button variant="success" size="lg" onClick = {handleConfirmPayment}>
                                    Confirm Payment
                                </Button>
                                </h4>
                            </Col>
                        </Row>
                        
                        
                    </>
                )}
            </Container>
           
            {showOrderCard && (
                <OrderCard message={message} orderId={orderId} total_orders={total_orders} sum_price={sum_price} />
            )}
            </div>
       
    );
}
export default Cart;
