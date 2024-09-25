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

    const handleDeleteMeal = async (mealId) => {
        try {
            await deleteMealFromPlan(mealId);
            const updatedMealPlan = await fetchMealPlan();
            setMealPlan(updatedMealPlan);
        } catch (error) {
            console.error('Error removing meal from plan:', error);
        }
    };

    const generateShoppingList = async () => {
        const ingredientsSet = new Set();
        for (const meal of mealPlan) {
            const recipe = savedRecipes.find((r) => r.id === meal.recipe_id);
            if (recipe && recipe.spoonacular_id) {
                try {
                    const recipeDetails = await fetchRecipeDetails(recipe.spoonacular_id);
                    if (recipeDetails && recipeDetails.extendedIngredients) {
                        recipeDetails.extendedIngredients.forEach((ingredient) => {
                            ingredientsSet.add(ingredient.original.trim());
                        });
                    }
                } catch (error) {
                    console.error('Error fetching recipe details for recipe with Spoonacular ID:', recipe.spoonacular_id, error);
                }
            }
        }
        const uniqueIngredients = Array.from(ingredientsSet);
        setShoppingList(uniqueIngredients);
    };

    const handleCheckboxChange = (ingredient) => {
        setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            [ingredient]: !prevCheckedItems[ingredient], 
        }));
    };

    return (
        <div className="container">
            <h2 className="my-4 text-center">Meal Planner</h2>

            <div className="card p-4 mb-4">
                <h3 className="card-title">Add a Meal</h3>
                <div className="form-group">
                    <select className="form-control mb-3" value={selectedRecipe} onChange={(e) => setSelectedRecipe(e.target.value)}>
                        <option value="">Select a recipe</option>
                        {savedRecipes.map((recipe) => (
                            <option key={recipe.id} value={recipe.id}>
                                {recipe.title}
                            </option>
                        ))}
                    </select>

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

                    <button className="btn btn-primary btn-block" onClick={handleAddMeal}>Add Meal</button>
                    {error && <p className="text-danger mt-2">{error}</p>}
                </div>
            </div>

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

            <div className="my-4">
                <h3>Generate Shopping List</h3>
                <button className="btn btn-success mb-3" onClick={generateShoppingList}>Generate Shopping List</button>

                {shoppingList.length > 0 && (
    <div className="card p-4">
        <h4 className="card-title">Shopping List</h4>
        <ul className="list-group">
            {shoppingList.map((ingredient, index) => (
                <li key={index} className="list-group-item d-flex align-items-center">
                    <label
                        htmlFor={`ingredient-${index}`}
                        className="w-100 d-flex align-items-center"
                        style={{ cursor: 'pointer' }}  // Ensures the entire item is clickable
                    >
                        <input
                            type="checkbox"
                            className="mr-3"
                            checked={!!checkedItems[ingredient]}
                            onChange={() => handleCheckboxChange(ingredient)}
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
