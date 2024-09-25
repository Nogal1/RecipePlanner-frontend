import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // Hook to access route parameters
import { fetchRecipeDetails } from '../../services/api';  // API call to fetch recipe details

// RecipeDetails component to display detailed information about a specific recipe
function RecipeDetails() {
    const { id } = useParams();  // Get recipe ID from the URL parameters
    const [recipe, setRecipe] = useState(null);  // State to store the recipe details
    const [error, setError] = useState('');  // State to store any error messages
    const [loading, setLoading] = useState(false);  // State to track loading status

    // useEffect to fetch recipe details when the component mounts or the ID changes
    useEffect(() => {
        const loadRecipeDetails = async () => {
            setLoading(true);  // Set loading to true while the data is being fetched
            setError('');  // Clear any previous error messages
            try {
                const response = await fetchRecipeDetails(id);  // Fetch detailed recipe info by ID
                setRecipe(response);  // Update the state with the fetched recipe
            } catch (error) {
                setError('Error fetching recipe details.');  // Set error message in case of failure
            } finally {
                setLoading(false);  // Set loading to false when the request completes
            }
        };

        loadRecipeDetails();  // Invoke the function to fetch recipe details
    }, [id]);  // useEffect will run whenever the `id` parameter changes

    // Loading, error, and null state handling
    if (loading) return <p>Loading...</p>;  // Display a loading message while fetching data
    if (error) return <p className="text-danger">{error}</p>;  // Display error message if an error occurs
    if (!recipe) return null;  // Return null if the recipe hasn't been fetched yet

    return (
        <div className="container my-5">
            <div className="card">
                <div className="row no-gutters">
                    {/* Image section of the recipe */}
                    <div className="col-md-6">
                        <img
                            src={recipe.image}  // Display the recipe image
                            alt={recipe.title}  // Alt text for the image
                            className="card-img"  // Use Bootstrap's card-img class for styling
                        />
                    </div>

                    {/* Recipe details section */}
                    <div className="col-md-6">
                        <div className="card-body">
                            <h2 className="card-title text-primary">{recipe.title}</h2>  {/* Recipe title */}
                            
                            {/* Ingredients list */}
                            <h5 className="text-muted mb-4">Ingredients</h5>
                            <ul className="list-group mb-4">
                                {recipe.extendedIngredients.map((ingredient, index) => (
                                    <li key={index} className="list-group-item">
                                        {ingredient.original}  {/* Display each ingredient */}
                                    </li>
                                ))}
                            </ul>

                            {/* Recipe instructions */}
                            <h5 className="text-muted mb-3">Instructions</h5>
                            <p className="card-text">{recipe.instructions}</p>  {/* Display the instructions */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetails;
