import React, { useState, useEffect } from 'react';
import { fetchSavedRecipes, deleteSavedRecipe } from '../../services/api';  // Import API functions
import { Link } from 'react-router-dom';  // Import Link for navigation
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';  // Import Bootstrap components for layout and styling

// Component to display saved recipes with sorting and deletion functionality
function SavedRecipes() {
    const [recipes, setRecipes] = useState([]);  // State to store the saved recipes
    const [error, setError] = useState('');  // State for error messages
    const [loading, setLoading] = useState(false);  // State to manage loading status
    const [sortOption, setSortOption] = useState('title');  // Default sort option set to 'title'
    const [sortOrder, setSortOrder] = useState('asc');  // Default sorting order set to ascending (A-Z)

    // Fetch saved recipes when the component mounts
    useEffect(() => {
        const loadSavedRecipes = async () => {
            setLoading(true);  // Set loading to true when fetching begins
            setError('');  // Clear previous error messages
            try {
                const response = await fetchSavedRecipes();  // Fetch saved recipes from the API
                setRecipes(response);  // Update state with fetched recipes
            } catch (error) {
                setError('Error fetching saved recipes.');  // Display error message if API call fails
            } finally {
                setLoading(false);  // Stop loading once data is fetched
            }
        };
        loadSavedRecipes();
    }, []);  // Empty dependency array ensures this effect runs only once, on mount

    // Handle sorting option change
    const handleSortChange = (e) => {
        setSortOption(e.target.value);  // Update the sort option when the user selects a new one
    };

    // Handle sorting order change (ascending or descending)
    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);  // Update the sort order based on user selection
    };

    // Function to delete a saved recipe
    const handleDeleteRecipe = async (recipeId) => {
        try {
            await deleteSavedRecipe(recipeId);  // Call the API to delete the recipe by ID
            setRecipes(recipes.filter(recipe => recipe.id !== recipeId));  // Remove the deleted recipe from the state
        } catch (error) {
            setError('Error deleting recipe. Please try again.');  // Handle errors from the API call
        }
    };

    // Function to sort recipes based on the selected sort option and order
    const sortedRecipes = () => {
        return [...recipes].sort((a, b) => {
            // Sort by title
            if (sortOption === 'title') {
                return sortOrder === 'asc'
                    ? a.title.localeCompare(b.title)  // Ascending order
                    : b.title.localeCompare(a.title);  // Descending order
            }
            // Sort by date (created_at)
            else if (sortOption === 'date') {
                return sortOrder === 'asc'
                    ? new Date(a.created_at) - new Date(b.created_at)  // Ascending by date (oldest first)
                    : new Date(b.created_at) - new Date(a.created_at);  // Descending by date (newest first)
            }
            return 0;  // Default case if no valid sort option is selected
        });
    };

    return (
        <Container>
            <h2 className="my-4 text-center">My Saved Recipes</h2>
            {loading && <p>Loading...</p>}  {/* Display loading message when fetching */}
            {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display error message if any */}

            {/* Sort options */}
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group controlId="sort">
                        <Form.Label>Sort By</Form.Label>
                        <Form.Control as="select" value={sortOption} onChange={handleSortChange}>
                            <option value="title">Title</option>  {/* Sort by title */}
                            <option value="date">Date Added</option>  {/* Sort by date */}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="order">
                        <Form.Label>Sort Order</Form.Label>
                        <Form.Control as="select" value={sortOrder} onChange={handleSortOrderChange}>
                            <option value="asc">A-Z / Oldest First</option>  {/* Ascending order */}
                            <option value="desc">Z-A / Newest First</option>  {/* Descending order */}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            {/* Display a message if no saved recipes are found */}
            {recipes.length === 0 && !loading && <p>No saved recipes yet.</p>}

            {/* Display the saved recipes in a grid format */}
            <Row>
                {sortedRecipes().map((recipe, index) => (
                    <Col md={4} className="mb-4" key={index}>
                        <Card>
                            <Card.Img variant="top" src={recipe.image_url} alt={recipe.title} />  {/* Recipe image */}
                            <Card.Body>
                                <Card.Title>{recipe.title}</Card.Title>  {/* Recipe title */}
                                <Card.Text>Date Added: {new Date(recipe.created_at).toLocaleDateString()}</Card.Text>  {/* Date added */}
                                <Link to={`/recipe/${recipe.spoonacular_id}`}>
                                    <Button variant="primary" className="btn-sm">View Details</Button>  {/* View details button */}
                                </Link>
                                <Button
                                    variant="danger"
                                    className="btn-sm ml-2"
                                    onClick={() => handleDeleteRecipe(recipe.id)}
                                >
                                    Delete
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default SavedRecipes;
