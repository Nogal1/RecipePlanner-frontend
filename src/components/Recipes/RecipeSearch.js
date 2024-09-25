import React, { useState, useEffect } from 'react';
import { searchRecipes, saveRecipe, fetchIngredientSuggestions } from '../../services/api';  // Import necessary API functions
import { Link } from 'react-router-dom';  // Import Link for navigation
import { Container, Row, Col, Form, Button, Card, ListGroup } from 'react-bootstrap';  // Import Bootstrap components for styling

// RecipeSearch component to search for recipes by ingredients
function RecipeSearch() {
    const [ingredients, setIngredients] = useState('');  // State to store ingredients input
    const [recipes, setRecipes] = useState([]);  // State to store search results
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);  // State for ingredient autocomplete suggestions
    const [error, setError] = useState('');  // State for error messages
    const [loading, setLoading] = useState(false);  // State for loading status
    const [sortOption, setSortOption] = useState('');  // State for sort option (e.g., by title)

    // Effect hook to sort recipes whenever the sort option changes
    useEffect(() => {
        if (recipes.length > 0) {
            sortRecipes(sortOption);  // Call sortRecipes function when sortOption changes
        }
    }, [sortOption]);

    // Fetch autocomplete suggestions for ingredients input
    const handleAutocomplete = async (query) => {
        if (query.trim().length < 2) return;  // Only trigger autocomplete for inputs with 2+ characters

        try {
            const suggestions = await fetchIngredientSuggestions(query);  // Fetch ingredient suggestions
            setAutocompleteSuggestions(suggestions);  // Update autocomplete suggestions
        } catch (error) {
            setError('Error fetching autocomplete suggestions.');
        }
    };

    // Handle search based on entered ingredients
    const handleSearch = async () => {
        if (!ingredients.trim()) {
            setError('Please enter ingredients to search.');  // Error message if no ingredients are entered
            return;
        }

        setLoading(true);  // Set loading state to true
        setError('');  // Clear previous error messages
        try {
            const response = await searchRecipes(ingredients);  // Fetch recipes based on ingredients
            setRecipes(response);  // Update recipes state
            setAutocompleteSuggestions([]);  // Clear autocomplete suggestions after search
        } catch (error) {
            setError('Error fetching recipes. Please try again.');
        } finally {
            setLoading(false);  // Set loading state to false after search completes
        }
    };

    // Handle saving a recipe to the user's account
    const handleSaveRecipe = async (recipe) => {
        const recipeData = {
            spoonacular_id: recipe.id,  // Use recipe ID from Spoonacular API
            title: recipe.title,
            image_url: recipe.image,
            ingredients: recipe.ingredients || "Ingredients not available"  // Default message if ingredients are not available
        };
    
        try {
            await saveRecipe(recipeData);  // Save the recipe
            alert('Recipe saved successfully!');
        } catch (error) {
            setError('Error saving recipe. Please try again.');
        }
    };

    // Function to sort the recipes array based on the selected option
    const sortRecipes = (option) => {
        let sortedRecipes = [...recipes];  // Make a copy of the recipes array

        if (option === 'title-asc') {
            sortedRecipes.sort((a, b) => a.title.localeCompare(b.title));  // Sort by title in ascending order
        } else if (option === 'title-desc') {
            sortedRecipes.sort((a, b) => b.title.localeCompare(a.title));  // Sort by title in descending order
        }

        setRecipes(sortedRecipes);  // Update the state with sorted recipes
    };

    return (
        <Container>
            <h2 className="my-4 text-center">Search By Ingredients</h2>  {/* Page heading */}

            {/* Input and Search Button */}
            <Row className="mb-3">
                <Col md={8}>
                    <Form.Control
                        type="text"
                        placeholder="Enter ingredients"
                        value={ingredients}
                        onChange={(e) => {
                            setIngredients(e.target.value);  // Update the ingredients state
                            handleAutocomplete(e.target.value);  // Fetch autocomplete suggestions
                        }}
                    />
                </Col>
                <Col md={4}>
                    <Button variant="primary" onClick={handleSearch} block>Search</Button>  {/* Search button */}
                </Col>
            </Row>

            {/* Autocomplete suggestions based on input */}
            {autocompleteSuggestions.length > 0 && (
                <ListGroup className="mb-3">
                    {autocompleteSuggestions.map((suggestion, index) => (
                        <ListGroup.Item key={index} onClick={() => setIngredients(suggestion.name)}>  {/* Clicking a suggestion fills the input */}
                            {suggestion.name}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            {/* Dropdown to sort search results */}
            <Form.Group as={Row} className="mb-3">
                <Col md={4}>
                    <Form.Control as="select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                        <option value="">Sort By</option>
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="title-desc">Title (Z-A)</option>
                    </Form.Control>
                </Col>
            </Form.Group>

            {loading && <p>Loading...</p>}  {/* Show loading message while fetching */}
            {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display error messages */}

            {/* Display recipe results in a grid layout */}
            <Row>
                {recipes.map((recipe, index) => (
                    <Col md={4} className="mb-4" key={index}>
                        <Card>
                            <Card.Img variant="top" src={recipe.image} alt={recipe.title} />  {/* Recipe image */}
                            <Card.Body>
                                <Card.Title>{recipe.title}</Card.Title>  {/* Recipe title */}
                                <div className="d-flex justify-content-between">
                                    <Link to={`/recipe/${recipe.id}`}>  {/* Link to recipe details */}
                                        <Button variant="primary" className="btn-sm">View Details</Button>
                                    </Link>
                                    <Button variant="success" onClick={() => handleSaveRecipe(recipe)} className="btn-sm">Save Recipe</Button>  {/* Save recipe button */}
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
