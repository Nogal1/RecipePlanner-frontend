import axios from 'axios';

const spoonacularApi = axios.create({
    baseURL: 'https://api.spoonacular.com',
    params: {
        apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
        hash: process.env.REACT_APP_USER_HASH,
    }
});

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
    const response = await api.get(`/recipes/search/${ingredients}`);
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
    const response = await axios.get('/recipes/my-recipes', {
        headers: { 'x-auth-token': token }  // Attach JWT token in the headers
    });
    return response.data;
};

// Fetch Recipe Details by ID
export const fetchRecipeDetails = async (id) => {
    const response = await axios.get(`/recipes/${id}`);
    return response.data;
};

// Update User Profile
export const updateUserProfile = async ({ email, password, newPassword }) => {
    const token = localStorage.getItem('token');  // Get JWT token from localStorage
    const response = await axios.post('/auth/profile', { email, password, newPassword }, {
        headers: { 'x-auth-token': token }
    });
    return response.data;
};

// Fetch the meal plan
export const fetchMealPlan = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('/meal-plans', {
        headers: { 'x-auth-token': token }
    });
    return response.data;
};

// Add a meal to the meal plan
export const addMealToPlan = async (mealData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post('/meal-plans/add', mealData, {
        headers: { 'x-auth-token': token }
    });
    return response.data;
};

// Delete a meal from the meal plan
export const deleteMealFromPlan = async (mealId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`/meal-plans/delete/${mealId}`, {
        headers: { 'x-auth-token': token }
    });
    return response.data;
};

// Add an item to the Spoonacular shopping list
export const addItemToSpoonacularShoppingList = async (item) => {
    try {
        const response = await spoonacularApi.post(`/mealplanner/${process.env.REACT_APP_USERNAME}/shopping-list/items`, {
            item: item,
            parse: true
        });
        return response.data;
    } catch (error) {
        console.error('Error adding item to Spoonacular shopping list:', error);
        throw error;
    }
};

// Fetch the user's current shopping list
export const fetchShoppingList = async () => {
    const token = localStorage.getItem('token');  // Retrieve the token from localStorage
    const response = await axios.get('/shopping-list', {
        headers: { 'x-auth-token': token }  // Use 'x-auth-token' as the authorization header
    });
    return response.data;
};



// Fetch random recipes from the Spoonacular API
export const fetchRandomRecipes = async () => {
    const SPOONACULAR_API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;  // Make sure to store your API key in environment variables
    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/random`, {
            params: {
                number: 5,  // Fetch 5 random recipes
                apiKey: SPOONACULAR_API_KEY
            }
        });
        return response.data.recipes;  // The random recipes are stored in the 'recipes' field
    } catch (error) {
        console.error('Error fetching random recipes:', error);
        throw error;
    }
};

// Add or update the user's shopping list
export const updateShoppingList = async (shoppingList) => {
    try {
        const response = await axios.post('http://localhost:3001/shopping-list', { ingredients: shoppingList });
        return response.data;
    } catch (error) {
        console.error('Error updating shopping list:', error);
        throw error;
    }
};