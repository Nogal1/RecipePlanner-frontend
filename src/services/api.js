import axios from 'axios';

// Base Axios instance
const api = axios.create({
    baseURL: 'http://localhost:3001',  // This should point to your backend
});

// Register user
export const registerUser = async (email, username, password) => {
    const response = await api.post('/auth/register', { email, username, password });
    return response.data;
};

// Login user
export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data.token;  // Return the JWT token
};

// Search recipes
export const searchRecipes = async (ingredients) => {
    const response = await api.get(`/search/${ingredients}`);
    return response.data;
};

// Save Recipe
export const saveRecipe = async (recipeData) => {
    const token = localStorage.getItem('token');  // Get JWT token from localStorage
    const response = await api.post('/recipes/save-recipe', recipeData, {
        headers: { 'x-auth-token': token }  // Attach JWT token in the headers
    });
    return response.data;
};


// Fetch Saved Recipes
export const fetchSavedRecipes = async () => {
    const token = localStorage.getItem('token');  // Get JWT token from localStorage
    const response = await api.get('/recipes/my-recipes', {
        headers: { 'x-auth-token': token }  // Attach JWT token in the headers
    });
    return response.data;
};


