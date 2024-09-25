import React, { useEffect, useState } from 'react';
import { fetchMealPlan, fetchShoppingList, fetchRandomRecipes, saveRecipe } from '../../services/api';  // API functions to interact with the backend
import { Link } from 'react-router-dom';  // Link for navigation between pages

// HomePage component displays the user's meal plan, shopping list, and random recipes
function HomePage() {
    // State variables to manage user data and application state
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track user authentication status
    const [shoppingList, setShoppingList] = useState([]);  // Store shopping list data
    const [todaysMeal, setTodaysMeal] = useState(null);  // Store today's meal data
    const [randomRecipes, setRandomRecipes] = useState([]);  // Store random recipes for display
    const [checkedItems, setCheckedItems] = useState({});  // Track checked state of shopping list items
    const [error, setError] = useState('');  // Store any error messages

    // Fetch data when component mounts (once), including meal plan, shopping list, and random recipes
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);  // Check if the user is logged in

        if (token) {
            loadUserData();  // Load meal plan and shopping list if logged in
        }
        loadRandomRecipes();  // Always load random recipes
    }, []);

    // Fetch meal plan and shopping list for the logged-in user
    const loadUserData = async () => {
        try {
            const shoppingListData = await fetchShoppingList();  // Fetch shopping list data from the API
            setShoppingList(shoppingListData);

            const mealPlan = await fetchMealPlan();  // Fetch meal plan data from the API
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });  // Get current day of the week
            const todaysMeal = mealPlan.find(meal => meal.day_of_week === today);  // Find today's meal from the plan
            setTodaysMeal(todaysMeal);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Fetch random recipes from the API for all users
    const loadRandomRecipes = async () => {
        try {
            const randomRecipesData = await fetchRandomRecipes();  // Fetch random recipes
            setRandomRecipes(randomRecipesData);
        } catch (error) {
            console.error('Error fetching random recipes:', error);
        }
    };

    // Handle checking/unchecking items in the shopping list
    const handleCheckboxChange = (item) => {
        setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            [item]: !prevCheckedItems[item],  // Toggle the checked state
        }));
    };

    // Handle saving a random recipe to the user's account
    const handleSaveRecipe = async (recipe) => {
        const recipeData = {
            spoonacular_id: recipe.id,  // Use Spoonacular recipe ID for saving
            title: recipe.title,
            image_url: recipe.image,
            ingredients: recipe.ingredients || "Ingredients not available"  // Default if ingredients not provided
        };

        try {
            await saveRecipe(recipeData);  // Save the recipe via API call
            alert('Recipe saved successfully!');
        } catch (error) {
            setError('Error saving recipe. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2 className="my-4 text-center">Welcome to Recipe Planner</h2>

            {/* Display meal plan and shopping list if user is logged in */}
            {isLoggedIn ? (
                <div>
                    {/* Display today's meal */}
                    <h3 className="my-3">Today's Meal</h3>
                    {todaysMeal ? (
                        <div className="card my-3">
                            <div className="card-body d-flex align-items-center">
                                <img src={todaysMeal.image_url} alt={todaysMeal.title} className="img-fluid rounded mr-3" style={{ maxWidth: '150px' }} />
                                <div>
                                    <h4 className="card-title">{todaysMeal.meal_type}: {todaysMeal.title}</h4>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>No meal planned for today.</p>
                    )}

                    {/* Display the user's shopping list */}
                    <h3 className="my-3">Your Shopping List</h3>
                    {shoppingList.length > 0 ? (
                        <ul className="list-group">
                            {shoppingList.map((item, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <label
                                        htmlFor={`ingredient-${index}`}
                                        className="w-100 d-flex align-items-center"
                                        style={{ cursor: 'pointer' }}  // Ensures the entire list item is clickable
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checkedItems[item] || false}  // Track checked state
                                            onChange={() => handleCheckboxChange(item)}  // Toggle checkbox
                                            id={`ingredient-${index}`}
                                            className="mr-2"
                                        />
                                        <span className="ml-2">{item}</span>  {/* Display ingredient name */}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Your shopping list is empty.</p>
                    )}
                </div>
            ) : null}

            {/* Display random recipes for all users */}
            <h3 className="my-3">Random Recipes</h3>
            <div className="row">
                {randomRecipes.length > 0 ? (
                    randomRecipes.map((recipe) => (
                        <div key={recipe.id} className="col-md-4 mb-4">
                            <div className="card h-100">
                                <img src={recipe.image} alt={recipe.title} className="card-img-top img-fluid" />
                                <div className="card-body">
                                    <h5 className="card-title">{recipe.title}</h5>
                                    <div className="btn-container">
                                        <Link to={`/recipe/${recipe.id}`} className="btn btn-primary">View Recipe Details</Link>
                                        {isLoggedIn && (
                                            <button onClick={() => handleSaveRecipe(recipe)} className="btn btn-success mt-2">Save Recipe</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading recipes...</p>
                )}
            </div>

            {/* Display any error messages */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default HomePage;
