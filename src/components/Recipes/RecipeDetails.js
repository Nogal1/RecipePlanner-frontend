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
    if (error) return <p className="text-danger">{error}</p>;
    if (!recipe) return null;

    return (
        <div className="container my-5">
            <div className="card">
                <div className="row no-gutters">
                    <div className="col-md-6">
                        <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="card-img"
                        />
                    </div>
                    <div className="col-md-6">
                        <div className="card-body">
                            <h2 className="card-title text-primary">{recipe.title}</h2>
                            <h5 className="text-muted mb-4">Ingredients</h5>
                            <ul className="list-group mb-4">
                                {recipe.extendedIngredients.map((ingredient, index) => (
                                    <li key={index} className="list-group-item">
                                        {ingredient.original}
                                    </li>
                                ))}
                            </ul>
                            <h5 className="text-muted mb-3">Instructions</h5>
                            <p className="card-text">{recipe.instructions}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetails;
