import React, { useState } from 'react';
import { registerUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate();  // Initialize useNavigate

    const handleRegister = async () => {
        setError('');
        setSuccess('');
        try {
            await registerUser(email, username, password);
            setSuccess('User registered successfully!');
            setEmail('');
            setUsername('');
            setPassword('');

            // Redirect to Login after successful registration
            setTimeout(() => {
                navigate('/login');  // Redirect to login page
            }, 1500);  // Optional: Add a delay before redirecting (1.5 seconds)

        } catch (error) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4">
                        <h2 className="text-center mb-4">Register</h2>
                        {error && <p className="text-danger text-center">{error}</p>}
                        {success && <p className="text-success text-center">{success}</p>}

                        <div className="form-group mb-3">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

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
