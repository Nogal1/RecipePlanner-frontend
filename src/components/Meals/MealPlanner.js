import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMealPlan, fetchSavedRecipes, addMealToPlan, deleteMealFromPlan, fetchRecipeDetails } from '../../services/api'; // Adjusted the imports as needed

function MealPlanner() {
    const [mealPlan, setMealPlan] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('Monday');
    const [mealType, setMealType] = useState('Lunch');
    const [error, setError] = useState('');
    const [shoppingList, setShoppingList] = useState([]); // Shopping list state
    const [checkedItems, setCheckedItems] = useState({}); // State to track checked items

    // Fetch meal plan and saved recipes on component load
    useEffect(() => {
        const loadData = async () => {
            try {
                const mealPlanData = await fetchMealPlan();
                const savedRecipesData = await fetchSavedRecipes();
                setMealPlan(mealPlanData);
                setSavedRecipes(savedRecipesData);
            } catch (error) {
                console.error('Error fetching meal plan or saved recipes:', error);
            }
        };
        loadData();
    }, []);

    // Handle adding a meal to the plan
    const handleAddMeal = async () => {
        if (!selectedRecipe) {
            setError('Please select a recipe');
            return;
        }
        try {
            await addMealToPlan({ recipe_id: selectedRecipe, day_of_week: dayOfWeek, meal_type: mealType });
            const updatedMealPlan = await fetchMealPlan();
            setMealPlan(updatedMealPlan);
            setError('');
        } catch (error) {
            console.error('Error adding meal to plan:', error);
            setError('Failed to add meal to the plan');
        }
    };

    // Handle deleting a meal from the plan
    const handleDeleteMeal = async (mealId) => {
        try {
            await deleteMealFromPlan(mealId);
            const updatedMealPlan = await fetchMealPlan();
            setMealPlan(updatedMealPlan);
        } catch (error) {
            console.error('Error removing meal from plan:', error);
        }
    };

    // Handle generating the shopping list
    const generateShoppingList = async () => {
        const ingredientsSet = new Set(); // Use a Set to avoid duplicates

        for (const meal of mealPlan) {
            const recipe = savedRecipes.find((r) => r.id === meal.recipe_id); // Match the recipe in savedRecipes
            if (recipe && recipe.spoonacular_id) {  // Ensure spoonacular_id is available
                try {
                    // Fetch full recipe details using spoonacular_id
                    const recipeDetails = await fetchRecipeDetails(recipe.spoonacular_id);  
                    if (recipeDetails && recipeDetails.extendedIngredients) {
                        recipeDetails.extendedIngredients.forEach((ingredient) => {
                            ingredientsSet.add(ingredient.original.trim());  // Add each ingredient to the Set
                        });
                    } else {
                        console.warn('No ingredients found for this recipe:', recipeDetails.title);
                    }
                } catch (error) {
                    console.error('Error fetching recipe details for recipe with Spoonacular ID:', recipe.spoonacular_id, error);
                }
            } else {
                console.warn('No matching spoonacular_id found for recipe:', meal.recipe_id);
            }
        }

        const uniqueIngredients = Array.from(ingredientsSet);  // Convert Set to an Array
        setShoppingList(uniqueIngredients);  // Store the generated list in the state
    };

    // Handle checking/unchecking ingredients
    const handleCheckboxChange = (ingredient) => {
        setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            [ingredient]: !prevCheckedItems[ingredient], // Toggle the checked state
        }));
    };

    return (
        <div>
            <h2>Meal Planner</h2>
            <div>
                <h3>Add a Meal</h3>

                {/* Dropdown to select a recipe from saved recipes */}
                <select
                    value={selectedRecipe}
                    onChange={(e) => setSelectedRecipe(e.target.value)}
                >
                    <option value="">Select a recipe</option>
                    {savedRecipes.map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                            {recipe.title}
                        </option>
                    ))}
                </select>

                {/* Day of week selection */}
                <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                </select>

                {/* Meal type selection */}
                <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                </select>

                <button onClick={handleAddMeal}>Add Meal</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <h3>Your Meal Plan</h3>
            <div>
                {mealPlan.length === 0 ? (
                    <p>No meals planned yet.</p>
                ) : (
                    mealPlan.map((meal) => {
                        const recipe = savedRecipes.find((r) => r.id === meal.recipe_id); // Match by recipe_id in meal
                        return (
                            <div key={meal.id}>
                                <p>{meal.day_of_week} - {meal.meal_type}: {recipe ? recipe.title : 'Unknown Recipe'}</p>
                                <img src={recipe ? recipe.image_url : ''} alt={recipe ? recipe.title : ''} width="100" />

                                {/* View Recipe Details Button */}
                                {recipe && (
                                    <Link to={`/recipe/${recipe.spoonacular_id}`}>
                                        <button>View Recipe Details</button>
                                    </Link>
                                )}

                                <button onClick={() => handleDeleteMeal(meal.id)}>Remove</button>
                            </div>
                        );
                    })
                )}
            </div>

            <h3>Generate Shopping List</h3>
            <button onClick={generateShoppingList}>Generate Shopping List</button>

            {/* Display Shopping List with Checkboxes */}
            {shoppingList.length > 0 && (
                <div>
                    <h3>Shopping List</h3>
                    <ul>
                        {shoppingList.map((ingredient, index) => (
                            <li key={index}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={!!checkedItems[ingredient]} // Track if the item is checked
                                        onChange={() => handleCheckboxChange(ingredient)} // Toggle checked state
                                    />
                                    {ingredient}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default MealPlanner;
