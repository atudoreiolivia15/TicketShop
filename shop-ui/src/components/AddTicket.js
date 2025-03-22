import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

function AddTicket ({ onHideModal,events, onSave }) {
    const [formData, setFormData] = useState({
        ticket_type: '',
        stock: '',
        price:'',
        event_id: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const saveTicket = (e) => {
        console.log('Input change detected', formData);  // Ar trebui să se afiseze în consolă

        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal show={true} onHide={onHideModal}>
            <Modal.Header>
                <Modal.Title>Add New Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={saveTicket}>
                <Form.Group controlId="formTicketType">
                    <Form.Label>Ticket type</Form.Label>
                    <Form.Control
                        as="select"
                        name="ticket_type" // Corrected: matches the state field
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
                             <option value="">Select a ticket type</option>
                        {events.map(event => (
                            <option key={event.id} value={event.id}>{event.name}</option>
                        ))}
                         </Form.Control>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="ticket-button">
                        Add Ticket
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default AddTicket;