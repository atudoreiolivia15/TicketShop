import axios from 'axios';
// extrage valoarea lui csrftoken
export function getCSRFToken() {
    const csrfCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : null;
}

export async function logout (navigate) {
    try {
        const csrfToken = getCSRFToken();
        const response = await axios.post('http://127.0.0.1:8000/api/logout',
            {},
            { 
                withCredentials: true,// sunt incluse cookie urile + sesinuea in cerere
                headers: {'X-CSRFToken': csrfToken}// asigura ca cererea este valid de Django
            }
        );

        localStorage.removeItem('userGroup');
        localStorage.removeItem('username');

        navigate('/login');
    } catch (error) {
        console.error('Logout failed', error);
    }
};
