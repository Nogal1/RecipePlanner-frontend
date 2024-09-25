import React, { useState, useEffect } from 'react';
import { searchRecipes, saveRecipe, fetchAutoCompleteRecipes } from '../../services/api';  // Import autocomplete
import { Link } from 'react-router-dom';  // Import Link

function RecipeSearch() {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);  // Autocomplete suggestions
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);  // Pagination state
    const [sortOption, setSortOption] = useState('');  // Sort option state

    useEffect(() => {
        if (recipes.length > 0) {
            sortRecipes(sortOption);
        }
    }, [sortOption]);  // Sort recipes whenever the sort option changes

    // Fetch autocomplete suggestions
    const handleAutocomplete = async (query) => {
        if (query.trim().length < 2) return;  // Don't trigger for too short queries

        try {
            const suggestions = await fetchAutoCompleteRecipes(query);
            setAutocompleteSuggestions(suggestions);
        } catch (error) {
            setError('Error fetching autocomplete suggestions.');
        }
    };

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
            setAutocompleteSuggestions([]);  // Clear autocomplete suggestions after search
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

    // Function to sort the recipes based on selected option
    const sortRecipes = (option) => {
        let sortedRecipes = [...recipes];  // Make a copy of the recipes array

        if (option === 'title-asc') {
            sortedRecipes.sort((a, b) => a.title.localeCompare(b.title));
        } else if (option === 'title-desc') {
            sortedRecipes.sort((a, b) => b.title.localeCompare(a.title));
        }

        setRecipes(sortedRecipes);  // Update the state with the sorted array
    };

    return (
        <div>
            <h2>Search By Ingredients</h2>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Enter ingredients"
                value={ingredients}
                onChange={(e) => {
                    setIngredients(e.target.value);
                    handleAutocomplete(e.target.value);  // Trigger autocomplete suggestions
                }}
            />
            <button onClick={handleSearch}>Search</button>

            {/* Autocomplete Suggestions */}
            {autocompleteSuggestions.length > 0 && (
                <ul>
                    {autocompleteSuggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => setIngredients(suggestion.title)}>
                            {suggestion.title}
                        </li>
                    ))}
                </ul>
            )}

            {/* Dropdown for sorting options */}
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="">Sort By</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
            </select>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Recipe Results */}
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

            {/* Pagination controls */}
            <button onClick={() => setPage(page > 1 ? page - 1 : 1)}>Previous</button>
            <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
    );
}

export default RecipeSearch;
