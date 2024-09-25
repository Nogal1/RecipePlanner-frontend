import React, { useState } from 'react';
import { registerUser } from '../../services/api';  // API function to register user
import { useNavigate } from 'react-router-dom';  // Allows navigation after registration

// Register component handles user registration by accepting email, username, and password
function Register() {
    // State variables to store user inputs and handle success or error messages
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();  // Initialize useNavigate to handle redirection

    // Function to handle user registration
    const handleRegister = async () => {
        setError('');  // Clear previous error messages
        setSuccess('');  // Clear previous success messages
        try {
            // Call registerUser API to register the new user
            await registerUser(email, username, password);
            
            // Display success message and clear input fields
            setSuccess('User registered successfully!');
            setEmail('');
            setUsername('');
            setPassword('');

            // Redirect to the login page after successful registration
            setTimeout(() => {
                navigate('/login');  // Redirect to the login page
            }, 1500);  // Optional delay of 1.5 seconds before redirection
        } catch (error) {
            // Display error message on failure
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4">
                        <h2 className="text-center mb-4">Register</h2>

                        {/* Display error or success messages */}
                        {error && <p className="text-danger text-center">{error}</p>}
                        {success && <p className="text-success text-center">{success}</p>}

                        {/* Input for email */}
                        <div className="form-group mb-3">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  // Update email state
                            />
                        </div>

                        {/* Input for username */}
                        <div className="form-group mb-3">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}  // Update username state
                            />
                        </div>

                        {/* Input for password */}
                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}  // Update password state
                            />
                        </div>

                        {/* Register button */}
                        <button className="btn btn-primary w-100" onClick={handleRegister}>
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
