import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

function EditUser ({  user, onHideModal, updateUser }) {
    const [formData, setFormData] = useState({ ...user });

    const handleInputChange = (e) =>{
        const {name, value} = e.target;
        setFormData({...formData,[name]: value});
    };

    const saveUser = (e) => {
        e.preventDefault();
        updateUser(formData);
    };

    return (
        <Modal show={true} onHide={onHideModal}>
        <Modal.Header>
            <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={saveUser}>
                <Form.Group controlId="formUserName">
                    <Form.Label>UserName</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formatActions">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formatActions">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formatActions">
                    <Form.Label>UserType</Form.Label>
                    <Form.Control
                        type="text"
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="event-button">
                    Edit User
                </Button>
            </Form>
        </Modal.Body>
    </Modal>
    );
}
export default EditUser;
