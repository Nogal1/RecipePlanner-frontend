import React, { useState, useEffect } from 'react';
import { fetchSavedRecipes } from '../../services/api';
import { Link } from 'react-router-dom';

function SavedRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sortOption, setSortOption] = useState('title');  // Default sorting by title
    const [sortOrder, setSortOrder] = useState('asc');  // Default ascending order

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

    const handleSortChange = (e) => {
        setSortOption(e.target.value);  // Update sorting option
    };

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);  // Update sort order (asc/desc)
    };

    // Function to sort recipes based on the selected option and order
    const sortedRecipes = () => {
        return [...recipes].sort((a, b) => {
            if (sortOption === 'title') {
                return sortOrder === 'asc'
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            } else if (sortOption === 'date') {
                return sortOrder === 'asc'
                    ? new Date(a.created_at) - new Date(b.created_at)
                    : new Date(b.created_at) - new Date(a.created_at);
            }
            return 0;
        });
    };

    return (
        <div>
            <h2>My Saved Recipes</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Sort Dropdown */}
            <label htmlFor="sort">Sort By: </label>
            <select id="sort" value={sortOption} onChange={handleSortChange}>
                <option value="title">Title</option>
                <option value="date">Date Added</option>
            </select>

            {/* Sort Order Dropdown */}
            <label htmlFor="order">Sort Order: </label>
            <select id="order" value={sortOrder} onChange={handleSortOrderChange}>
                <option value="asc">A-Z / Oldest First</option>
                <option value="desc">Z-A / Newest First</option>
            </select>

            <div>
                {recipes.length === 0 && !loading && <p>No saved recipes yet.</p>}  {/* Show message if no recipes */}
                {sortedRecipes().map((recipe, index) => (
                    <div key={index}>
                        <h3>{recipe.title}</h3>
                        <img src={recipe.image_url} alt={recipe.title} width="100" />
                        <p>Date Added: {new Date(recipe.created_at).toLocaleDateString()}</p>
                        <Link to={`/recipe/${recipe.spoonacular_id}`}>
                            <button>View Details</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SavedRecipes;
