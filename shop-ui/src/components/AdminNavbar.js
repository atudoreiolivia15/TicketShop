import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { logout } from './Session';

function AdminNavbar() {
  const navigate = useNavigate();  // Use the hook to get the navigate function

  const handleLogout = async () => {
    await logout(navigate);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/admin-dashboard">Admin Dashboard</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/events">Events</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
          </Nav>
        </Container>
        <Button
          onClick={handleLogout}
          className="btn btn-light btn-sm me-3"
        >
          <i className="bi bi-box-arrow-right"></i>
        </Button>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
