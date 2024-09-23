import React, { useState } from 'react';
import { loginUser } from '../../services/api';

function Login({ setIsAuthenticated }) {  // Pass state update function as a prop
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async () => {
        setError('');
        setSuccess('');
        try {
            const token = await loginUser(email, password);
            localStorage.setItem('token', token);  // Store JWT in localStorage
            setSuccess('Login successful!');
            setIsAuthenticated(true);  // Update authentication state
        } catch (error) {
            setError('Login failed. Check your credentials.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
