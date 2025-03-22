import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

function AddEvent ({ onHideModal, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        location: '',
        user: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    };

    const saveEvent = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal show={true} onHide={onHideModal}>
            <Modal.Header>
                <Modal.Title>Add New Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={saveEvent}>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formLocation">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formUser">
                        <Form.Label>Event Owner (User)</Form.Label>
                        <Form.Control
                            type="text"
                            name="user"
                            value={formData.user}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="event-button">
                        Add Event
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default AddEvent;