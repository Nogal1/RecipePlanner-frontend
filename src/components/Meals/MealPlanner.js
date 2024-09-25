import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMealPlan, fetchSavedRecipes, addMealToPlan, deleteMealFromPlan, fetchRecipeDetails } from '../../services/api'; // Import API functions

// MealPlanner component to manage user meal plans and shopping lists
function MealPlanner() {
    const [mealPlan, setMealPlan] = useState([]);  // State for storing the user's meal plan
    const [savedRecipes, setSavedRecipes] = useState([]);  // State for storing user's saved recipes
    const [selectedRecipe, setSelectedRecipe] = useState('');  // State for currently selected recipe in the form
    const [dayOfWeek, setDayOfWeek] = useState('Monday');  // State for selected day of the week
    const [mealType, setMealType] = useState('Lunch');  // State for selected meal type (e.g., breakfast, lunch, dinner)
    const [error, setError] = useState('');  // State for error handling
    const [shoppingList, setShoppingList] = useState([]);  // State for the generated shopping list
    const [checkedItems, setCheckedItems] = useState({});  // State to track which items are checked in the shopping list

    // useEffect to fetch the meal plan and saved recipes when the component mounts
    useEffect(() => {
        const loadData = async () => {
            try {
                const mealPlanData = await fetchMealPlan();  // Fetch user's meal plan from the server
                const savedRecipesData = await fetchSavedRecipes();  // Fetch user's saved recipes
                setMealPlan(mealPlanData);  // Update meal plan state
                setSavedRecipes(savedRecipesData);  // Update saved recipes state
            } catch (error) {
                console.error('Error fetching meal plan or saved recipes:', error);  // Log any errors
            }
        };
        loadData();
    }, []);  // Empty dependency array ensures this runs only once, when the component mounts

    // Function to handle adding a meal to the meal plan
    const handleAddMeal = async () => {
        if (!selectedRecipe) {  // Ensure a recipe is selected
            setError('Please select a recipe');
            return;
        }
        try {
            await addMealToPlan({ recipe_id: selectedRecipe, day_of_week: dayOfWeek, meal_type: mealType });  // API call to add meal to plan
            const updatedMealPlan = await fetchMealPlan();  // Fetch updated meal plan after adding the meal
            setMealPlan(updatedMealPlan);  // Update the state with the new meal plan
            setError('');  // Clear error state
        } catch (error) {
            console.error('Error adding meal to plan:', error);
            setError('Failed to add meal to the plan');
        }
    };

    // Function to handle deleting a meal from the meal plan
    const handleDeleteMeal = async (mealId) => {
        try {
            await deleteMealFromPlan(mealId);  // API call to delete meal from the plan
            const updatedMealPlan = await fetchMealPlan();  // Fetch updated meal plan after deletion
            setMealPlan(updatedMealPlan);  // Update the state with the new meal plan
        } catch (error) {
            console.error('Error removing meal from plan:', error);
        }
    };

    // Function to generate the shopping list from the meal plan
    const generateShoppingList = async () => {
        const ingredientsSet = new Set();  // Using a Set to avoid duplicate ingredients

        // Loop through each meal in the meal plan and fetch its recipe details
        for (const meal of mealPlan) {
            const recipe = savedRecipes.find((r) => r.id === meal.recipe_id);  // Find the recipe for the current meal
            if (recipe && recipe.spoonacular_id) {
                try {
                    const recipeDetails = await fetchRecipeDetails(recipe.spoonacular_id);  // Fetch detailed recipe data
                    if (recipeDetails && recipeDetails.extendedIngredients) {
                        // Add each ingredient to the Set
                        recipeDetails.extendedIngredients.forEach((ingredient) => {
                            ingredientsSet.add(ingredient.original.trim());
                        });
                    }
                } catch (error) {
                    console.error('Error fetching recipe details for recipe with Spoonacular ID:', recipe.spoonacular_id, error);
                }
            }
        }
        const uniqueIngredients = Array.from(ingredientsSet);  // Convert Set to an Array
        setShoppingList(uniqueIngredients);  // Update the shopping list state with unique ingredients
    };

    // Function to handle checking/unchecking ingredients in the shopping list
    const handleCheckboxChange = (ingredient) => {
        setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            [ingredient]: !prevCheckedItems[ingredient],  // Toggle the checked state of the ingredient
        }));
    };

    return (
        <div className="container">
            <h2 className="my-4 text-center">Meal Planner</h2>

            {/* Form to add a meal to the plan */}
            <div className="card p-4 mb-4">
                <h3 className="card-title">Add a Meal</h3>
                <div className="form-group">
                    {/* Dropdown to select a recipe from the saved recipes */}
                    <select className="form-control mb-3" value={selectedRecipe} onChange={(e) => setSelectedRecipe(e.target.value)}>
                        <option value="">Select a recipe</option>
                        {savedRecipes.map((recipe) => (
                            <option key={recipe.id} value={recipe.id}>
                                {recipe.title}
                            </option>
                        ))}
                    </select>

                    {/* Dropdowns to select day of the week and meal type */}
                    <div className="row mb-3">
                        <div className="col">
                            <select className="form-control" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                            </select>
                        </div>
                        <div className="col">
                            <select className="form-control" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                            </select>
                        </div>
                    </div>

                    {/* Button to add the meal to the plan */}
                    <button className="btn btn-primary btn-block" onClick={handleAddMeal}>Add Meal</button>
                    {error && <p className="text-danger mt-2">{error}</p>}
                </div>
            </div>

            {/* Display the user's meal plan */}
            <h3>Your Meal Plan</h3>
            <div className="row">
                {mealPlan.length === 0 ? (
                    <p>No meals planned yet.</p>
                ) : (
                    mealPlan.map((meal) => {
                        const recipe = savedRecipes.find((r) => r.id === meal.recipe_id);
                        return (
                            <div key={meal.id} className="col-md-4">
                                <div className="card mb-4">
                                    <img src={recipe ? recipe.image_url : ''} alt={recipe ? recipe.title : ''} className="card-img-top" />
                                    <div className="card-body">
                                        <p>{meal.day_of_week} - {meal.meal_type}: {recipe ? recipe.title : 'Unknown Recipe'}</p>
                                        {recipe && (
                                            <Link to={`/recipe/${recipe.spoonacular_id}`}>
                                                <button className="btn btn-outline-primary btn-sm">View Recipe</button>
                                            </Link>
                                        )}
                                        <button className="btn btn-danger btn-sm ml-2" onClick={() => handleDeleteMeal(meal.id)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Section to generate and display the shopping list */}
            <div className="my-4">
                <h3>Generate Shopping List</h3>
                <button className="btn btn-success mb-3" onClick={generateShoppingList}>Generate Shopping List</button>

                {/* Display the shopping list with checkboxes */}
                {shoppingList.length > 0 && (
                    <div className="card p-4">
                        <h4 className="card-title">Shopping List</h4>
                        <ul className="list-group">
                            {shoppingList.map((ingredient, index) => (
                                <li key={index} className="list-group-item d-flex align-items-center">
                                    <label
                                        htmlFor={`ingredient-${index}`}
                                        className="w-100 d-flex align-items-center"
                                        style={{ cursor: 'pointer' }}  // Make the entire list item clickable
                                    >
                                        <input
                                            type="checkbox"
                                            className="mr-3"
                                            checked={!!checkedItems[ingredient]}  // Check if item is checked
                                            onChange={() => handleCheckboxChange(ingredient)}  // Toggle checked state
                                            id={`ingredient-${index}`}
                                        />
                                        <span className="ml-2">{ingredient}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MealPlanner;
