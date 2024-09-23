import React, { useState, useEffect } from 'react';
import { fetchSavedRecipes } from '../../services/api';

function SavedRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadSavedRecipes = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetchSavedRecipes();
                setRecipes(response);
            } catch (error) {
                setError('Error fetching saved recipes.');
            } finally {
                setLoading(false);
            }
        };
        loadSavedRecipes();
    }, []);

    return (
        <div>
            <h2>My Saved Recipes</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                {recipes.length === 0 && !loading && <p>No saved recipes yet.</p>}  {/* Show message if no recipes */}
                {recipes.map((recipe, index) => (
                    <div key={index}>
                        <h3>{recipe.title}</h3>
                        <img src={recipe.image_url} alt={recipe.title} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SavedRecipes;
