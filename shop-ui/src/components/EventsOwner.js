import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import OwnerNavbar from './OwnerNavbar';
import EditEvent from './EditEvent';
import AddEvent from './AddEvent';

function EventsOwner() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [editingEvent, setEditingEvent] = useState(null);
    const [addingEvent, setAddingEvent] = useState(false);

    useEffect(() => {
        const getEvents = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/events`,{
                    withCredentials: true 
                });
                setEvents(response.data);
                setError('');
            } catch (error) {
                console.log(error)
                setError('Failed to fetch events.');
            }
        }

        getEvents();
    }, []);

    const handleEditEvent = (event) => {
        setEditingEvent(event);
    };

    const handleDeleteEvent = async (event) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/events/delete/${event.id}`);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event');
        }
    };

    const updateEvent = async (updatedEvent) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/events/update/${updatedEvent.id}`, updatedEvent);
            window.location.reload();//Refresh the page to load the latest changes
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Failed to update event');
        }
    };

    const cancelEditEvent = () => {
        setEditingEvent(null);
    };

    const handleAddEvent = (event) => {
        setAddingEvent(true);
    };

    const closeAddEventModal = () => {
        setAddingEvent(false);
    };

    const addEvent = async (event) => {
        try {
            await axios.post('http://127.0.0.1:8000/api/events/add', event);
            window.location.reload();
        } catch (error) {
            console.error('Error adding event:', error);
            alert('Failed to add event');
        }
    };

    return (
        <div>
            <OwnerNavbar/>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Event name</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Event owner</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {events.map((event) => (
                    <tr key={event.id}>
                        <td>{event.id}</td>
                        <td>{event.name}</td>
                        <td>{event.description}</td>
                        <td>{new Date(event.date).toLocaleString()}</td>
                        <td>{event.location}</td>
                        <td>{event.user.username}</td>
                        <td style={{textAlign: 'center'}}>
                            <Button onClick={() => handleEditEvent(event)}><i className="bi bi-pencil-fill"></i></Button>
                            <Button onClick={() => handleDeleteEvent(event)} variant='danger' style={{marginLeft:'6px'}}><i className="bi bi-trash3-fill"></i></Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Button className='add-button' onClick={() => handleAddEvent()}>Add Event</Button>

            {editingEvent && (
                <EditEvent
                    event={editingEvent} // datele evenimentului curent
                    onHideModal={cancelEditEvent} // functie care inchide fereasta 
                    updateEvent={updateEvent}//functie care salveaza modificarile
                    cancelEditEvent={cancelEditEvent} 
                />)}

            {addingEvent && (
                <AddEvent 
                    onHideModal={closeAddEventModal}
                    onSave={addEvent}
                />)}
        </div>
    );
}

export default EventsOwner;