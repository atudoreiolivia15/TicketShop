import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import Events from './components/Events';
import Tickets from './components/Tickets';
import Users from './components/Users';
import EventsOwner from './components/EventsOwner';
import OwnerDashboard from './components/OwnerDashboard';
import Cart from './components/Cart'
import ClientNavbar from './components/ClientNavbar';
const ProtectedRoute = ({ children, requiredGroup }) => {
  const userGroup = localStorage.getItem('userGroup');

  console.log(document.cookie)
  if (!userGroup) {
    if (requiredGroup === "login") {
      return children;
    }
    return <Navigate to="/login" />;
  }

  if (userGroup !== requiredGroup) {
    // redirectionare user catre dashboard ul specific grupului
    if (userGroup === "Event Owner"){
      return <Navigate to = "/owner-dashboard"/>;
    }
    if (userGroup === "Administrator"){
      return <Navigate to = "/admin-dashboard"/>;
    }
    if (userGroup === "Client"){
      return <Navigate to = "/client-dashboard"/>;
    }
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Login /></ProtectedRoute>} />
        <Route path="/login" element={<ProtectedRoute requiredGroup="login"><Login /></ProtectedRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute><ClientDashboard/></ProtectedRoute>}/>
        <Route path="/admin-dashboard" element={<ProtectedRoute requiredGroup="Administrator"><AdminDashboard/></ProtectedRoute>}/>
        <Route path="/events" element={<ProtectedRoute requiredGroup="Administrator"><Events /></ProtectedRoute>}/>
        <Route path="/tickets" element={<ProtectedRoute requiredGroup="Event Owner"><Tickets /></ProtectedRoute>}/>
        <Route path="/users" element={<ProtectedRoute requiredGroup="Administrator"><Users /></ProtectedRoute>}/>
        <Route path="/owner-dashboard" element={<ProtectedRoute requiredGroup="Event Owner"><OwnerDashboard/></ProtectedRoute>}/>
        <Route path="/events-owner" element={<ProtectedRoute requiredGroup="Event Owner"><EventsOwner /></ProtectedRoute>}/>
        <Route path="/client-dashboard" element={<ProtectedRoute requiredGroup="Client"><ClientDashboard/></ProtectedRoute>}/>
        <Route path="/client-navbar" element={<ProtectedRoute requiredGroup="Client"><ClientNavbar/></ProtectedRoute>}/>
        <Route path="/cart" element={<ProtectedRoute requiredGroup="Client"><Cart/></ProtectedRoute>}/>
      </Routes>
    </Router>
  );
}

export default App;
