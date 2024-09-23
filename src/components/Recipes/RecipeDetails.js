import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRecipeDetails } from '../../services/api';

function RecipeDetails() {
    const { id } = useParams();  // Get recipe ID from the URL
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadRecipeDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetchRecipeDetails(id);  // Fetch detailed recipe info
                setRecipe(response);
            } catch (error) {
                setError('Error fetching recipe details.');
            } finally {
                setLoading(false);
            }
        };

        loadRecipeDetails();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!recipe) return null;

    return (
        <div>
            <h2>{recipe.title}</h2>
            <img src={recipe.image} alt={recipe.title} />
            <p>{recipe.instructions}</p>
            <p>Ingredients: {recipe.extendedIngredients.map(ing => ing.original).join(', ')}</p>
        </div>
    );
}

export default RecipeDetails;
