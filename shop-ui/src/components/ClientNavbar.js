import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { logout } from './Session';

function ClientNavbar({onSearch ,cartCount,cart}) {
  const navigate = useNavigate();
  const location = useLocation();  //   pentru a obtine acces la state-ul transmis
  const tickets = location.state?.tickets || [];
  
  const handleLogout = async () => {
    await logout(navigate);
  };

  const handleCart = async () => {
    navigate("/cart" ,{ state: { cart } } );
  }; 
  const handleSearch = async (e) => {
    e.preventDefault(); // previne reincrcarea paginii
    const searchTerm = e.target.elements.search.value.trim();
    if (searchTerm) {
      onSearch(searchTerm); 
    }
    else{
      onSearch("");
    }
    
    
};

const isCartPage = location.pathname === "/cart";
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/client-dashboard"  style={{ marginLeft: '-100px' }}>Tickets Shop</Navbar.Brand>
          {!isCartPage && (
           <Form 
            className="d-flex mx-auto" 
            style={{ width: '70%', height: '40px'}} 
            onSubmit={handleSearch}
          >
            <Form.Control
              type="search"
              placeholder="Search Event"
              className="me-2"
              aria-label="Search"
              name="search"
            />
            <Button variant="outline-light" type="submit">Search</Button>
          </Form>
          )}

          <div className="ms-auto d-flex align-items-center" style={{ marginRight: '-100px' }}> 
            <Button
                onClick={handleCart} 
                className="btn btn-light btn-sm  me-2"
                >
                <i className="bi bi-cart3"></i> 
                {cartCount > 0 && (
                  <span className="badge bg-danger ms-1">{cartCount}</span>
                 )}
                </Button>
            
            <Button 
                onClick={handleLogout} 
                className="btn btn-light btn-sm" 
            >
                <i className="bi bi-box-arrow-right" ></i>
            </Button>
          </div>  
        </Container>
      </Navbar>
    </>
  );
}

export default ClientNavbar;
