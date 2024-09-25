import React, { useState } from 'react';
import { loginUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection

function Login({ setIsAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();  // Initialize navigate for redirection

    const handleLogin = async () => {
        setError('');
        setSuccess('');
        try {
            const token = await loginUser(email, password);
            localStorage.setItem('token', token);  // Store JWT in localStorage
            setSuccess('Login successful!');
            setIsAuthenticated(true);  // Update authentication state
            navigate('/');  // Redirect to HomePage after successful login
        } catch (error) {
            setError('Login failed. Check your credentials.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4">
                        <h2 className="text-center mb-4">Login</h2>
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
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

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
