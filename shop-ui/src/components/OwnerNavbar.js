import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { logout } from './Session';

function OwnerNavbar() {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout(navigate);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/owner-dashboard">Owner Dashboard</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/events-owner">Events</Nav.Link>
          </Nav>
          <Nav className="me-auto">
            <Nav.Link href="/tickets">Tickets</Nav.Link>
          </Nav>
          <Button
            onClick={handleLogout}
            className="btn btn-light btn-sm"
          >
            <i className="bi bi-box-arrow-right"></i>
          </Button>
        </Container>
      </Navbar>
    </>
  );
}

export default OwnerNavbar;
