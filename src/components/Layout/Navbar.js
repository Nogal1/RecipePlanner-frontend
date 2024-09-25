import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';

function AppNavbar({ isAuthenticated, setIsAuthenticated }) {
    const handleLogout = () => {
        localStorage.removeItem('token');  // Remove JWT token on logout
        setIsAuthenticated(false);  // Update state to logged out
        window.location.href = '/login';   // Redirect to login page
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);  // If token exists, set user as authenticated
        }
    }, [setIsAuthenticated]);

    return (
        <Navbar bg="--primary-color" variant="dark" expand="lg" className="mb-4">
            <Navbar.Brand as={Link} to="/">
                Recipe Planner
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/search">Search Recipes</Nav.Link>
                    {!isAuthenticated ? (
                        <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/saved-recipes">My Recipes</Nav.Link>
                            <Nav.Link as={Link} to="/meal-planner">Meal Planner</Nav.Link>
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
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
