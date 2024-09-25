import React, { useState, useEffect } from 'react';
import { updateShoppingList, fetchRecipeDetails,fetchMealPlan, fetchSavedRecipes, addMealToPlan, deleteMealFromPlan } from '../../services/api';
import { Link } from 'react-router-dom';

function MealPlanner() {
    const [mealPlan, setMealPlan] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [mealType, setMealType] = useState('');
    const [error, setError] = useState('');
    const [shoppingList, setShoppingList] = useState([]);  // Shopping list state
    
    useEffect(() => {
        const loadMealPlanAndRecipes = async () => {
            try {
                const mealPlanData = await fetchMealPlan();
                setMealPlan(mealPlanData);

                const savedRecipesData = await fetchSavedRecipes();
                setSavedRecipes(savedRecipesData);
            } catch (error) {
                console.error('Error fetching meal plan or saved recipes', error);
            }
        };
        loadMealPlanAndRecipes();
    }, []);

    const handleAddMeal = async () => {
        if (!selectedRecipe) {
            setError('Please select a recipe');
            return;
        }

        try {
            await addMealToPlan({ recipe_id: selectedRecipe, spoonacular_id: selectedRecipe, day_of_week: dayOfWeek, meal_type: mealType });
            const updatedPlan = await fetchMealPlan();
            setMealPlan(updatedPlan);
            setError('');
        } catch (error) {
            console.error('Error adding meal to plan', error);
            setError('Failed to add meal to the plan');
        }
    };

    const handleDeleteMeal = async (mealId) => {
        try {
            await deleteMealFromPlan(mealId);
            const updatedPlan = await fetchMealPlan();
            setMealPlan(updatedPlan);
        } catch (error) {
            console.error('Error removing meal from plan', error);
        }
    };

    // Generate shopping list and send to backend to save
const generateShoppingList = async () => {
    console.log('Generating shopping list...');
    const ingredientsSet = new Set();  // Use Set to avoid duplicates

    for (const meal of mealPlan) {
        const recipe = savedRecipes.find((r) => r.id === meal.recipe_id);  // Match recipe in savedRecipes
        if (recipe && recipe.spoonacular_id) {  // Ensure spoonacular_id is available
            try {
                // Fetch full recipe details using spoonacular_id
                const recipeDetails = await fetchRecipeDetails(recipe.spoonacular_id);
                if (recipeDetails && recipeDetails.extendedIngredients) {
                    recipeDetails.extendedIngredients.forEach((ingredient) => {
                        ingredientsSet.add(ingredient.original.trim());  // Add each ingredient to Set
                    });
                }
            } catch (error) {
                console.error(`Error fetching recipe details for recipe with Spoonacular ID: ${recipe.spoonacular_id}`);
            }
        }
    }

    const uniqueIngredients = Array.from(ingredientsSet);  // Convert Set to Array
    setShoppingList(uniqueIngredients);  // Store the generated list

    // Send the shopping list to the backend to save
    try {
        await updateShoppingList(uniqueIngredients);
        console.log('Shopping list saved to the database');
    } catch (error) {
        console.error('Error saving shopping list:', error);
    }
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
                        const recipe = savedRecipes.find((r) => r.id === meal.recipe_id);  // Match by recipe_id in meal
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

            {/* Display Shopping List */}
            {shoppingList.length > 0 && (
                <div>
                    <h3>Shopping List</h3>
                    <ul>
                        {shoppingList.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default MealPlanner;
