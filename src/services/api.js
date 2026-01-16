import axios from 'axios';

const isLocal = window.location.hostname === 'localhost';
const API_URL = isLocal ? 'http://localhost:5000' : 'https://duge5780.odns.fr';

export const getBaseUrl = () => API_URL;

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const login = async (username, password) => {
    const res = await api.post('/login', { username, password });
    localStorage.setItem('token', res.data.access_token);

    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
};

export const register = async (userData, avatarFile) => {
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('password', userData.password);
    formData.append('first_name', userData.first_name);
    formData.append('last_name', userData.last_name);
    formData.append('city', userData.city);
    formData.append('bio', userData.bio);

    if (avatarFile) {
        formData.append('avatar', avatarFile);
    }

    return api.post('/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export default api;
