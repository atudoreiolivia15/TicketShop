import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import AdminNavbar from './AdminNavbar';
import EditUser from './EditUser';
import AddUser from './AddUser';
import { getCSRFToken } from './Session';

function Users() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [addingUser, setAddingUser] = useState(false);

    // Fetch users when component mounts
    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/users', {
                    withCredentials: true // Make sure cookies are sent with the request
                });
                setUsers(response.data); // Store users data
                setError('');
            } catch (error) {
                setError('Failed to fetch users.');
            }
        };

        getUsers();
    }, []);


    // Add user action
    const addUser = async (user) => {
        try {
        
            const response = await axios.post(`http://127.0.0.1:8000/api/users/add`, user);
            setUsers([...users, response.data]); // Add new user to state
            setAddingUser(false); // Close add modal
            window.location.reload();
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user');
        }
    };
    const handleDeleteUser = async (user) => {
        try {
            const csrfToken = getCSRFToken();
            await axios.delete(`http://127.0.0.1:8000/api/users/delete/${user.id}`,{
                withCredentials: true,
                headers: {'X-CSRFToken': csrfToken}
        });
            window.location.reload();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const updateUser = async (updatedUser) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/users/update/${updatedUser.id}`, updatedUser);
            window.location.reload();//Refresh the page to load the latest changes
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    const cancelEditUser = () => {
        setEditingUser(null);
    };

    const handleAddUser = (user) => {
        setAddingUser(true);
    };

    const closeAddUserModal = () => {
        setAddingUser(false);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
    };
    return (
        <div>
            <AdminNavbar />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>#</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>User Type</th>
                        <th>Password</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.first_name}</td>
                            <td> {user.last_name}</td>
                            <td>{user.user_type}</td>
                            <td>{user.password}</td>
                            <td style={{textAlign: 'center'}}>
                            <Button onClick={() => handleEditUser(user)}><i className="bi bi-pencil-fill"></i></Button>
                            <Button onClick={() => handleDeleteUser(user)} variant='danger' style={{marginLeft:'6px'}}><i className="bi bi-trash3-fill"></i></Button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Button className='add-button' onClick={() => handleAddUser()}>Add User</Button>
            {editingUser && (
                <EditUser
                    user={editingUser} // datele evenimentului curent
                    onHideModal={cancelEditUser} // functie care inchide fereasta 
                    updateUser={updateUser}//functie care salveaza modificarile
                    cancelEditUser={cancelEditUser} 
                />)}

            {addingUser && (
                <AddUser
                    
                    onHideModal={closeAddUserModal}
                    onSave={addUser}
                />)}
        </div>
    );
}

export default Users;
