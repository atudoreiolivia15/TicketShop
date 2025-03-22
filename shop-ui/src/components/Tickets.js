import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import OwnerNavbar from './OwnerNavbar';
import EditTicket from './EditTicket';
import AddTicket from './AddTicket';

import { getCSRFToken } from './Session';

function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [editingTicket, setEditingTicket] = useState(null);
    const [addingTicket, setAddingTicket] = useState(false);

    useEffect(() => {
        const getTickets = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/tickets`,{
                    withCredentials: true 
                });

                setTickets(response.data.tickets);
                setEvents(response.data.events);
                setError('');
            } catch (error) {
                setError('Failed to fetch tickets.');
            }
        }

        getTickets();
    }, []);

    const handleEditTicket = (ticket) => {
        setEditingTicket(ticket);
    };

    const addTicket = async (ticket) => {
        try {
            console.log(ticket.event_id);
            const csrfToken = getCSRFToken();
            const response = await axios.post('http://127.0.0.1:8000/api/tickets/add', ticket, {
                withCredentials: true,
                headers: {'X-CSRFToken': csrfToken}
            });
            window.location.reload();
           
        } catch (error) {
            console.error('Error adding ticket:', error);
            alert('Failed to add ticket');
        }
    };

    const handleDeleteTicket = async (ticket) => {
        try {
            const csrfToken = getCSRFToken();
            await axios.delete(`http://127.0.0.1:8000/api/tickets/delete/${ticket.id}`, { 
                withCredentials: true,
                headers: {'X-CSRFToken': csrfToken}
            });
            window.location.reload();
        } catch (error) {
            console.error('Error deleting ticket:', error);
            alert('Failed to delete ticket');
        }
    };

    const updateTicket = async (updatedTicket) => {
        try {
            const csrfToken = getCSRFToken();
            await axios.post(`http://127.0.0.1:8000/api/tickets/update/${updatedTicket.id}`, updatedTicket,{
                    withCredentials: true ,
                    headers: {'X-CSRFToken': csrfToken}
                }
            );
            window.location.reload();
        } catch (error) {
            console.error('Error updating ticket:', error);
            alert('Failed to update ticket');
        }
    };

    const cancelEditTicket = () => {
        setEditingTicket(null);
    };

    const handleAddTicket = (event) => {
        setAddingTicket(true);
    };

    const closeAddTicketModal = () => {
        setAddingTicket(false);
    };

    const getEventName = (eventId) => {
        const event = events.find(event => event.id === eventId);
        return event.name || "(untitled)";
    };

    return (
        <div>
            <OwnerNavbar/>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Table striped bordered hover>
            <thead>
                    <tr>
                        <th>#</th>
                        <th> Ticket type</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Event</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.ticket_type}</td>
                        <td>{ticket.stock}</td>
                        <td>{ticket.price}</td>
                        <td>{getEventName(ticket.event_id)}</td>
                        <td style={{textAlign: 'center'}}>
                            <Button onClick={() => handleEditTicket(ticket)}><i className="bi bi-pencil-fill"></i></Button>
                            <Button onClick={() => handleDeleteTicket(ticket)} variant='danger' style={{marginLeft:'6px'}}><i className="bi bi-trash3-fill"></i></Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Button className='add-button' onClick={() => handleAddTicket()}>Add Ticket</Button>

            {editingTicket && (
                <EditTicket
                    ticket={editingTicket} // datele evenimentului curent
                    events={events}
                    onHideModal={cancelEditTicket} // functie care inchide fereasta 
                    updateTicket={updateTicket}//functie care salveaza modificarile
                    cancelEditTicket={cancelEditTicket} 
                />)}

            {addingTicket && (
                <AddTicket 
                    onHideModal={closeAddTicketModal}
                    events={events}
                    onSave={addTicket}
                />)}
        </div>
    );
}

export default Tickets;