import React, { useState } from 'react';
import { searchRecipes, saveRecipe } from '../../services/api';
import { Link } from 'react-router-dom';  // Import Link

function RecipeSearch() {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);  // Pagination state

    const handleSearch = async () => {
        if (!ingredients.trim()) {
            setError('Please enter ingredients to search.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await searchRecipes(ingredients, page);
            setRecipes(response);
        } catch (error) {
            setError('Error fetching recipes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveRecipe = async (recipe) => {
        const recipeData = {
            spoonacular_id: recipe.id,
            title: recipe.title,
            image_url: recipe.image,
            ingredients: recipe.ingredients || "Ingredients not available"
        };
    
        try {
            await saveRecipe(recipeData);
            alert('Recipe saved successfully!');
        } catch (error) {
            setError('Error saving recipe. Please try again.');
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
                        <img src={recipe.image} alt={recipe.title} />
                        {/* View Details Button */}
                        <Link to={`/recipe/${recipe.id}`}>
                            <button>View Details</button>
                        </Link>
                        <button onClick={() => handleSaveRecipe(recipe)}>Save Recipe</button>
                    </div>
                ))}
            </div>
            <button onClick={() => setPage(page > 1 ? page - 1 : 1)}>Previous</button>
            <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
    );
}

export default RecipeSearch;
