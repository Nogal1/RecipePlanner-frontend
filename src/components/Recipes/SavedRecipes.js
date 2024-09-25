import React, { useState, useEffect } from 'react';
import { fetchSavedRecipes, deleteSavedRecipe } from '../../services/api';  // Import deleteSavedRecipe API function
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';  // Import Bootstrap components

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

    const handleDeleteRecipe = async (recipeId) => {
        try {
            await deleteSavedRecipe(recipeId);  // Call the API to delete the recipe
            setRecipes(recipes.filter(recipe => recipe.id !== recipeId));  // Remove the deleted recipe from the state
        } catch (error) {
            setError('Error deleting recipe. Please try again.');
        }
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
        <Container>
            <h2 className="my-4 text-center">My Saved Recipes</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group controlId="sort">
                        <Form.Label>Sort By</Form.Label>
                        <Form.Control as="select" value={sortOption} onChange={handleSortChange}>
                            <option value="title">Title</option>
                            <option value="date">Date Added</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="order">
                        <Form.Label>Sort Order</Form.Label>
                        <Form.Control as="select" value={sortOrder} onChange={handleSortOrderChange}>
                            <option value="asc">A-Z / Oldest First</option>
                            <option value="desc">Z-A / Newest First</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            {recipes.length === 0 && !loading && <p>No saved recipes yet.</p>}  {/* Show message if no recipes */}

            <Row>
                {sortedRecipes().map((recipe, index) => (
                    <Col md={4} className="mb-4" key={index}>
                        <Card>
                            <Card.Img variant="top" src={recipe.image_url} alt={recipe.title} />
                            <Card.Body>
                                <Card.Title>{recipe.title}</Card.Title>
                                <Card.Text>Date Added: {new Date(recipe.created_at).toLocaleDateString()}</Card.Text>
                                <Link to={`/recipe/${recipe.spoonacular_id}`}>
                                    <Button variant="primary" className="btn-sm">View Details</Button>
                                </Link>
                                <Button
                                    variant="danger"
                                    className="btn-sm ml-2"
                                    onClick={() => handleDeleteRecipe(recipe.id)}  // Handle recipe deletion
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
