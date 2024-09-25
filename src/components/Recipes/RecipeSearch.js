import React, { useState } from 'react';
import { searchRecipes, saveRecipe, fetchAutoCompleteRecipes } from '../../services/api';  // Assuming this API function is added
import { Link } from 'react-router-dom';

function RecipeSearch() {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);  // Pagination state
    const [suggestions, setSuggestions] = useState([]);  // Autocomplete suggestions

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

    // Fetch autocomplete suggestions
    const fetchSuggestions = async (query) => {
        if (query.length > 1) {
            try {
                const response = await fetchAutoCompleteRecipes(query);
                setSuggestions(response);  // Save suggestions from the API
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setIngredients(suggestion.title);
        setSuggestions([]);  // Clear suggestions after selection
    };

    return (
        <div>
            <h2>Search Recipes</h2>

            {/* Input with auto-complete suggestions */}
            <input
                type="text"
                placeholder="Enter ingredients"
                value={ingredients}
                onChange={(e) => {
                    setIngredients(e.target.value);
                    fetchSuggestions(e.target.value);  // Fetch suggestions as the user types
                }}
            />
            <button onClick={handleSearch}>Search</button>

            {/* Autocomplete suggestions */}
            {suggestions.length > 0 && (
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)} style={{ cursor: 'pointer' }}>
                            {suggestion.title}
                        </li>
                    ))}
                </ul>
            )}

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Display recipes */}
            <div>
                {recipes.map((recipe, index) => (
                    <div key={index}>
                        <h3>{recipe.title}</h3>
                        <img src={recipe.image} alt={recipe.title} width="100" />
                        {/* View Details Button */}
                        <Link to={`/recipe/${recipe.id}`}>
                            <button>View Details</button>
                        </Link>
                        <button onClick={() => handleSaveRecipe(recipe)}>Save Recipe</button>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <button onClick={() => setPage(page > 1 ? page - 1 : 1)}>Previous</button>
            <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
    );
}

export default RecipeSearch;
