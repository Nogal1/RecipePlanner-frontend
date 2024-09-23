import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');  // Remove JWT token on logout
        window.location.href = '/login';   // Redirect to login
    };

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/search">Search Recipes</Link></li>  {/* Ensure this points to /search */}
                {!token ? (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/saved-recipes">My Recipes</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
