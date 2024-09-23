import React, { useState, useEffect } from 'react';
import { fetchMealPlan, addMealToPlan, deleteMealFromPlan, fetchSavedRecipes } from '../../services/api';  // Fetch saved recipes as well

function MealPlanner() {
    const [mealPlan, setMealPlan] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);  // List of saved recipes
    const [selectedRecipe, setSelectedRecipe] = useState('');  // Selected recipe ID
    const [dayOfWeek, setDayOfWeek] = useState('Monday');  // Default day is Monday
    const [mealType, setMealType] = useState('lunch');  // Default meal type
    const [error, setError] = useState('');  // To show error messages

    // Fetch the user's meal plan and saved recipes on load
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
            await addMealToPlan({ recipe_id: selectedRecipe, day_of_week: dayOfWeek, meal_type: mealType });
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
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                </select>

                <button onClick={handleAddMeal}>Add Meal</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <h3>Your Meal Plan</h3>
            <div>
                {mealPlan.length === 0 ? (
                    <p>No meals planned yet.</p>
                ) : (
                    mealPlan.map((meal) => (
                        <div key={meal.id}>
                            <p>{meal.day_of_week} - {meal.meal_type}: {meal.title}</p>
                            <img src={meal.image_url} alt={meal.title} width="100" />
                            <button onClick={() => handleDeleteMeal(meal.id)}>Remove</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MealPlanner;
