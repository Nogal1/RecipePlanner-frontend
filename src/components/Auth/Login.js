import React, { useState } from 'react';
import { loginUser } from '../../services/api';  // Import API service for logging in
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection

// Login component for user authentication
function Login({ setIsAuthenticated }) {
    // State for storing form data (email, password), error, and success messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // useNavigate hook to programmatically navigate after successful login
    const navigate = useNavigate();

    // Function to handle user login
    const handleLogin = async () => {
        setError('');  // Clear any previous error messages
        setSuccess('');  // Clear any previous success messages
        try {
            // Send login request using the loginUser API function
            const token = await loginUser(email, password);
            
            // Store JWT token in localStorage for future authenticated requests
            localStorage.setItem('token', token);

            setSuccess('Login successful!');  // Display success message
            setIsAuthenticated(true);  // Update parent component's state to indicate successful authentication

            navigate('/');  // Redirect to the home page after successful login
        } catch (error) {
            setError('Login failed. Check your credentials.');  // Display error message on login failure
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4">
                        {/* Login heading */}
                        <h2 className="text-center mb-4">Login</h2>
                        
                        {/* Display error or success messages */}
                        {error && <p className="text-danger text-center">{error}</p>}
                        {success && <p className="text-success text-center">{success}</p>}

                        {/* Email input field */}
                        <div className="form-group mb-3">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  // Update email state on input change
                            />
                        </div>

                        {/* Password input field */}
                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}  // Update password state on input change
                            />
                        </div>

                        {/* Login button */}
                        <button className="btn btn-primary w-100" onClick={handleLogin}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
