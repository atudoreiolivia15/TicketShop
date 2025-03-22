import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // trimitem datele de la user catre server folosind axios 
      const response = await axios.post('http://127.0.0.1:8000/api/login',
        { username, password },
        { withCredentials: true }
      );
      console.log(response.data);
      let user = response.data.user;
      
      localStorage.setItem('userGroup', user.group);
      localStorage.setItem('username', user.username);

      if (user.group === 'Administrator') {
        navigate('/admin-dashboard');
      } 
      else if (user.group === "Event Owner") {
        navigate('/owner-dashboard');
      }
      else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{margin:'10%'}}>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>Username:</Form.Label>
          <Form.Control placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </Form.Group>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button type="submit" variant="primary">Login</Button>
      </Form>
    </div>
  );
}

export default Login;