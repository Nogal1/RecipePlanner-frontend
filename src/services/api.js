import axios from 'axios';

// Base Axios instance
const api = axios.create({
    baseURL: 'http://localhost:3001',  // This should point to your backend
});

// Register user
export const registerUser = async (email, username, password) => {
    const response = await api.post('/register', { email, username, password });
    return response.data;
};

// Login user
export const loginUser = async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data.token;  // Return the token
};

// Search recipes
export const searchRecipes = async (ingredients) => {
    const response = await api.get(`/search/${ingredients}`);
    return response.data;
};

// Fetch saved recipes (JWT required)
export const fetchSavedRecipes = async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/my-recipes', {
        headers: { 'x-auth-token': token },
    });
    return response.data;
};
