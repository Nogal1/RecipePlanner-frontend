import axios from 'axios';

// Spoonacular API instance for interacting with external API
const spoonacularApi = axios.create({
    baseURL: 'https://api.spoonacular.com',
    params: {
        apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,  // API key for Spoonacular
        hash: process.env.REACT_APP_USER_HASH,  // User hash for Spoonacular (optional)
    }
});

// Base Axios instance for interacting with the backend server
const api = axios.create({
    baseURL: 'http://localhost:3001',  // Local backend API
});

// Register a new user
export const registerUser = async (email, username, password) => {
    const response = await api.post('/auth/register', { email, username, password });
    return response.data;  // Return the response data
};

// Login a user and return the JWT token
export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data.token;  // Return the JWT token
};

// Search for recipes based on ingredients
export const searchRecipes = async (ingredients) => {
    const response = await api.get(`/recipes/search/${ingredients}`);
    return response.data;  // Return the search results
};

// Save a recipe to the user's account
export const saveRecipe = async (recipeData) => {
    const token = localStorage.getItem('token');  // Get JWT token from local storage
    const response = await api.post('/recipes/save-recipe', recipeData, {
        headers: { 'x-auth-token': token }  // Attach JWT token in headers
    });
    return response.data;  // Return the response data
};

// Delete a saved recipe by its ID
export const deleteSavedRecipe = async (recipeId) => {
    const token = localStorage.getItem('token');  // Get JWT token from local storage
    await api.delete(`/recipes/my-recipes/${recipeId}`, {
        headers: { 'x-auth-token': token }  // Attach JWT token in headers
    });
};

// Fetch all saved recipes for the authenticated user
export const fetchSavedRecipes = async () => {
    const token = localStorage.getItem('token');  // Get JWT token from local storage
    const response = await api.get('/recipes/my-recipes', {
        headers: { 'x-auth-token': token }  // Attach JWT token in headers
    });
    return response.data;  // Return the list of saved recipes
};

// Fetch detailed recipe information by recipe ID
export const fetchRecipeDetails = async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;  // Return detailed recipe information
};

// Update the user's profile (email or password)
export const updateUserProfile = async ({ email, password, newPassword }) => {
    const token = localStorage.getItem('token');  // Get JWT token from local storage
    const response = await api.post('/auth/profile', { email, password, newPassword }, {
        headers: { 'x-auth-token': token }  // Attach JWT token in headers
    });
    return response.data;  // Return the updated user profile
};

// Fetch the user's meal plan
export const fetchMealPlan = async () => {
    const token = localStorage.getItem('token');  // Get JWT token from local storage
    const response = await api.get('/meal-plans', {
        headers: { 'x-auth-token': token }  // Attach JWT token in headers
    });
    return response.data;  // Return the meal plan
};

// Add a meal to the user's meal plan
export const addMealToPlan = async (mealData) => {
    const token = localStorage.getItem('token');  // Get JWT token from local storage
    const response = await api.post('/meal-plans/add', mealData, {
        headers: { 'x-auth-token': token }  // Attach JWT token in headers
    });
    return response.data;  // Return the added meal
};

// Delete a meal from the user's meal plan
export const deleteMealFromPlan = async (mealId) => {
    const token = localStorage.getItem('token');  // Get JWT token from local storage
    const response = await api.delete(`/meal-plans/delete/${mealId}`, {
        headers: { 'x-auth-token': token }  // Attach JWT token in headers
    });
    return response.data;  // Return the response from deletion
};

// Add an item to Spoonacular's shopping list
export const addItemToSpoonacularShoppingList = async (item) => {
    const response = await spoonacularApi.post(`/mealplanner/${process.env.REACT_APP_USERNAME}/shopping-list/items`, {
        item: item,
        parse: true  // Enable Spoonacular to parse the item
    });
    return response.data;  // Return the updated shopping list
};

// Fetch the user's shopping list
export const fetchShoppingList = async () => {
    const token = localStorage.getItem('token');  // Get JWT token from local storage
    const response = await api.get('/shopping-list', {
        headers: { 'x-auth-token': token }  // Attach JWT token in headers
    });
    return response.data;  // Return the shopping list
};

// Fetch random recipes from the backend API
export const fetchRandomRecipes = async () => {
    const response = await api.get('/api/random-recipes');
    return response.data;  // Return the list of random recipes
};

// Fetch autocomplete suggestions for ingredients from the backend
export const fetchIngredientSuggestions = async (query) => {
    const response = await api.get('/api/ingredients/autocomplete', { params: { query } });
    return response.data;  // Return the autocomplete suggestions
};

// Update the user's shopping list by replacing it with a new list of ingredients
export const updateShoppingList = async (shoppingList) => {
    const token = localStorage.getItem('token');  // Get JWT token from local storage
    const response = await api.post('/shopping-list', { ingredients: shoppingList }, {
        headers: { 'x-auth-token': token }  // Attach JWT token in headers
    });
    return response.data;  // Return the updated shopping list
};
