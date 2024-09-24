import React, { useEffect, useState } from 'react';
import { fetchMealPlan, fetchShoppingList, fetchRandomRecipes } from '../../services/api';  // Assuming these API functions are defined
import { Link } from 'react-router-dom';

function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [shoppingList, setShoppingList] = useState([]);
    const [todaysMeal, setTodaysMeal] = useState(null);
    const [randomRecipes, setRandomRecipes] = useState([]);

    useEffect(() => {
        // Check if user is logged in by checking token (or another authentication mechanism)
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        if (token) {
            // If logged in, fetch today's meal and shopping list
            loadUserData();
        } else {
            // If not logged in, fetch random recipes
            loadRandomRecipes();
        }
    }, []);

    const loadUserData = async () => {
        try {
            const shoppingListData = await fetchShoppingList();
            console.log("Shopping list:", shoppingListData);  // Debugging log
            setShoppingList(shoppingListData);
    
            const mealPlan = await fetchMealPlan();
            console.log("Meal plan:", mealPlan);  // Debugging log
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            const todaysMeal = mealPlan.find(meal => meal.day_of_week === today);
            console.log("Today's meal:", todaysMeal);  // Debugging log
            setTodaysMeal(todaysMeal);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    
    const loadRandomRecipes = async () => {
        try {
            const randomRecipesData = await fetchRandomRecipes();
            console.log("Random recipes:", randomRecipesData);  // Debugging log
            setRandomRecipes(randomRecipesData);
        } catch (error) {
            console.error('Error fetching random recipes:', error);
        }
    };

    return (
        <div>
    <h2>Welcome to Recipe Planner</h2>
    {isLoggedIn ? (
        <div>
            <h3>Today's Meal</h3>
            {todaysMeal ? (
                <div>
                    <p>{todaysMeal.meal_type}: {todaysMeal.title}</p>  {/* Using todaysMeal.title directly */}
                    <img src={todaysMeal.image_url} alt={todaysMeal.title} width="100" />
                    <Link to={`/recipe/${todaysMeal.recipe_id}`}> {/* Use the recipe_id for the details link */}
                        <button>View Recipe Details</button>
                    </Link>
                </div>
            ) : (
                <p>No meal planned for today.</p>
            )}

            <h3>Your Shopping List</h3>
            {shoppingList.length > 0 ? (
                <ul>
                    {shoppingList.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p>Your shopping list is empty.</p>
            )}
        </div>
    ) : (
        <div>
            <h3>Recipes</h3>
            {randomRecipes.length > 0 ? (
                randomRecipes.map((recipe) => (
                    <div key={recipe.id}>
                        <p>{recipe.title}</p>
                        <img src={recipe.image} alt={recipe.title} width="100" />
                        <Link to={`/recipe/${recipe.spoonacular_id}`}>
                            <button>View Recipe Details</button>
                        </Link>
                    </div>
                ))
            ) : (
                <p>Loading recipes...</p>
            )}
        </div>
    )}
</div>
    );
}

export default HomePage;
