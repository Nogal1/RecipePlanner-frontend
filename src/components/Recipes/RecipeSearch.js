import React, { useState, useEffect } from 'react';
import { searchRecipes, saveRecipe, fetchIngredientSuggestions } from '../../services/api';  // Import the correct API function
import { Link } from 'react-router-dom';  // Import Link
import { Container, Row, Col, Form, Button, Card, ListGroup } from 'react-bootstrap';  // Import Bootstrap components

function RecipeSearch() {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);  // Autocomplete suggestions
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sortOption, setSortOption] = useState('');  // Sort option state

    useEffect(() => {
        if (recipes.length > 0) {
            sortRecipes(sortOption);
        }
    }, [sortOption]);  // Sort recipes whenever the sort option changes

    // Fetch autocomplete suggestions for ingredients
    const handleAutocomplete = async (query) => {
        if (query.trim().length < 2) return;  // Don't trigger for too short queries

        try {
            const suggestions = await fetchIngredientSuggestions(query);  // Fetch ingredient suggestions from API
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
            const response = await searchRecipes(ingredients);
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
        <Container>
            <h2 className="my-4 text-center">Search By Ingredients</h2>

            <Row className="mb-3">
                <Col md={8}>
                    <Form.Control
                        type="text"
                        placeholder="Enter ingredients"
                        value={ingredients}
                        onChange={(e) => {
                            setIngredients(e.target.value);
                            handleAutocomplete(e.target.value);  // Trigger autocomplete suggestions
                        }}
                    />
                </Col>
                <Col md={4}>
                    <Button variant="primary" onClick={handleSearch} block>Search</Button>
                </Col>
            </Row>

            {/* Autocomplete Suggestions */}
            {autocompleteSuggestions.length > 0 && (
                <ListGroup className="mb-3">
                    {autocompleteSuggestions.map((suggestion, index) => (
                        <ListGroup.Item key={index} onClick={() => setIngredients(suggestion.name)}>
                            {suggestion.name}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            {/* Dropdown for sorting options */}
            <Form.Group as={Row} className="mb-3">
                <Col md={4}>
                    <Form.Control as="select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                        <option value="">Sort By</option>
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="title-desc">Title (Z-A)</option>
                    </Form.Control>
                </Col>
            </Form.Group>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Recipe Results */}
            <Row>
                {recipes.map((recipe, index) => (
                    <Col md={4} className="mb-4" key={index}>
                        <Card>
                            <Card.Img variant="top" src={recipe.image} alt={recipe.title} />
                            <Card.Body>
                                <Card.Title>{recipe.title}</Card.Title>
                                <div className="d-flex justify-content-between">
                                    <Link to={`/recipe/${recipe.id}`}>
                                        <Button variant="primary" className="btn-sm">View Details</Button>
                                    </Link>
                                    <Button variant="success" onClick={() => handleSaveRecipe(recipe)} className="btn-sm">Save Recipe</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default RecipeSearch;
