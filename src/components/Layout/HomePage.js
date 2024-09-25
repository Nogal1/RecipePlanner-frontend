import React, { useEffect, useState } from 'react';
import { fetchMealPlan, fetchShoppingList, fetchRandomRecipes, saveRecipe } from '../../services/api';
import { Link } from 'react-router-dom';

function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [shoppingList, setShoppingList] = useState([]);
    const [todaysMeal, setTodaysMeal] = useState(null);
    const [randomRecipes, setRandomRecipes] = useState([]);
    const [checkedItems, setCheckedItems] = useState({}); // State to track checked items
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        if (token) {
            loadUserData();
        }
        loadRandomRecipes();  // Always load random recipes
    }, []);

    const loadUserData = async () => {
        try {
            const shoppingListData = await fetchShoppingList();
            setShoppingList(shoppingListData);
    
            const mealPlan = await fetchMealPlan();
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            const todaysMeal = mealPlan.find(meal => meal.day_of_week === today);
            setTodaysMeal(todaysMeal);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const loadRandomRecipes = async () => {
        try {
            const randomRecipesData = await fetchRandomRecipes();
            setRandomRecipes(randomRecipesData);
        } catch (error) {
            console.error('Error fetching random recipes:', error);
        }
    };

    const handleCheckboxChange = (item) => {
        setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            [item]: !prevCheckedItems[item],
        }));
    };

    const handleSaveRecipe = async (recipe) => {
        const recipeData = {
            spoonacular_id: recipe.id,  // Assuming `id` here is the Spoonacular recipe id
            title: recipe.title,
            image_url: recipe.image,
            ingredients: recipe.ingredients || "Ingredients not available"  // You may not have all ingredients in the random data
        };

        try {
            await saveRecipe(recipeData);  // Save recipe to user's account
            alert('Recipe saved successfully!');
        } catch (error) {
            setError('Error saving recipe. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2 className="my-4 text-center">Welcome to Recipe Planner</h2>

            {isLoggedIn ? (
                <div>
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

                    <h3 className="my-3">Your Shopping List</h3>
                    {shoppingList.length > 0 ? (
    <ul className="list-group">
        {shoppingList.map((item, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <label
                    htmlFor={`ingredient-${index}`}
                    className="w-100 d-flex align-items-center"
                    style={{ cursor: 'pointer' }} // Ensures the entire item is clickable
                >
                    <input
                        type="checkbox"
                        checked={checkedItems[item] || false}
                        onChange={() => handleCheckboxChange(item)}
                        id={`ingredient-${index}`}
                        className="mr-2"
                    />
                    <span className="ml-2">
                        {item}
                    </span>
                </label>
            </li>
        ))}
    </ul>
) : (
    <p>Your shopping list is empty.</p>
)}
                </div>
            ) : null}

            {/* Random Recipes Section */}
            <h3 className="my-3">Random Recipes</h3>
            <div className="row">
                {randomRecipes.length > 0 ? (
                    randomRecipes.map((recipe) => (
                        <div key={recipe.id} className="col-md-4 mb-4">
                            <div className="card h-100">
                                <img src={recipe.image} alt={recipe.title} className="card-img-top img-fluid" />
                                <div className="card-body">
                                    <h5 className="card-title">{recipe.title}</h5>
                                    <div className='btn-cotainer'>
                                    <Link to={`/recipe/${recipe.id}`} className="btn btn-primary">
                                        View Recipe Details
                                    </Link>
                                    {isLoggedIn && (
                                        <button onClick={() => handleSaveRecipe(recipe)} className="btn btn-success">
                                            Save Recipe
                                        </button>
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

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default HomePage;
