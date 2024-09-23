import React, { useState } from 'react';
import { searchRecipes, saveRecipe } from '../../services/api';

function RecipeSearch() {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await searchRecipes(ingredients);
            setRecipes(response);
        } catch (error) {
            setError('Error fetching recipes.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveRecipe = async (recipe) => {
        const recipeData = {
            spoonacular_id: recipe.id,            // Get the recipe ID
            title: recipe.title,                  // Recipe title
            image_url: recipe.image,              // Recipe image URL
            ingredients: recipe.ingredients,      // Ingredients (if available)
        };
    
        try {
            await saveRecipe(recipeData);  // Save the recipe using the API
            alert('Recipe saved successfully!');
        } catch (error) {
            setError('Error saving recipe.');
        }
    };

    return (
        <div>
            <h2>Search Recipes</h2>
            <input
                type="text"
                placeholder="Enter ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                {recipes.map((recipe, index) => (
                    <div key={index}>
                        <h3>{recipe.title}</h3>
                        <img src={recipe.image || recipe.image_url} alt={recipe.title} />
                        <button onClick={() => handleSaveRecipe(recipe)}>Save Recipe</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecipeSearch;
