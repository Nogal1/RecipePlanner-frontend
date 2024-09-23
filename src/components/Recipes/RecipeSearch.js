import React, { useState } from 'react';
import { searchRecipes } from '../../services/api';

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
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecipeSearch;
