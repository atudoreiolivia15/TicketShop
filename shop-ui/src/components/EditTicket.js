import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Events from './Events';

function EditTicket ({ ticket, events, onHideModal, updateTicket }) {
    const [formData, setFormData] = useState({ ...ticket });// initialieaza formData cu datele evenimentului

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const saveTicket = (e) => {
        e.preventDefault();
        updateTicket(formData);
    };

    return (
        <Modal show={true} onHide={onHideModal}>
            <Modal.Header>
                <Modal.Title>Edit Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={saveTicket}>
                    <Form.Group controlId="formTicketType">
                    <Form.Control
                            as="select"
                            name="ticket_type"
                            value={formData.ticket_type}
                            onChange={handleInputChange}
                            required
                        >
                        <option value="">Select a ticket type</option> 
                        <option value="VIP">VIP</option>
                        <option value="Standard">Standard</option>
                        <option value="Economy">Economy</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formStock">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                            type="text"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formEvent">
                        <Form.Label>Event</Form.Label>
                        <Form.Control
                            as="select"
                            name="event_id"
                            value={formData.event_id}
                            onChange={handleInputChange}
                            required
                        >
                        {events.map(event => (
                            <option key={event.id} value={event.id}>{event.name}</option>
                        ))}
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="ticket-button">
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditTicket;
