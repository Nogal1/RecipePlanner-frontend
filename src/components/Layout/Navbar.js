import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';  // React Router's Link for navigation
import { Navbar, Nav, Button } from 'react-bootstrap';  // Bootstrap components for the navigation bar

// AppNavbar component to handle navigation and user authentication state
function AppNavbar({ isAuthenticated, setIsAuthenticated }) {
    // Function to handle user logout
    const handleLogout = () => {
        localStorage.removeItem('token');  // Remove JWT token from local storage
        setIsAuthenticated(false);  // Update the state to indicate the user is logged out
        window.location.href = '/login';   // Redirect to the login page
    };

    // Check if the user is authenticated on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');  // Get token from localStorage
        if (token) {
            setIsAuthenticated(true);  // If token exists, set authentication to true
        }
    }, [setIsAuthenticated]);  // Dependency on setIsAuthenticated to ensure correct authentication state

    return (
        <Navbar bg="--primary-color" variant="dark" expand="lg" className="mb-4">
            {/* Navbar Brand (Logo or Name) that links to the Home page */}
            <Navbar.Brand as={Link} to="/">
                Recipe Planner
            </Navbar.Brand>

            {/* Toggle button for collapsible navbar on smaller screens */}
            <Navbar.Toggle aria-controls="navbar-nav" />

            {/* Navbar items collapseable for mobile view */}
            <Navbar.Collapse id="navbar-nav">
                {/* Navigation Links aligned to the right */}
                <Nav className="ml-auto">
                    {/* Always visible links */}
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/search">Search Recipes</Nav.Link>

                    {/* Conditional rendering based on authentication status */}
                    {!isAuthenticated ? (
                        <>
                            {/* If not authenticated, show Login and Register links */}
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                        </>
                    ) : (
                        <>
                            {/* If authenticated, show links to user's saved recipes, meal planner, and profile */}
                            <Nav.Link as={Link} to="/saved-recipes">My Recipes</Nav.Link>
                            <Nav.Link as={Link} to="/meal-planner">Meal Planner</Nav.Link>
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>

                            {/* Logout button to trigger handleLogout */}
                            <Button variant="outline-light" onClick={handleLogout} className="ml-2">
                                Logout
                            </Button>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AppNavbar;
