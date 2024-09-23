import React, { useState, useEffect } from 'react';
import { fetchSavedRecipes, updateUserProfile } from '../../services/api';  // Add API calls for saved recipes and user update

function Profile() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch user saved recipes on profile load
    useEffect(() => {
        const loadSavedRecipes = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetchSavedRecipes();
                setRecipes(response);
            } catch (error) {
                setError('Error fetching saved recipes.');
            } finally {
                setLoading(false);
            }
        };
        loadSavedRecipes();
    }, []);

    // Update user email or password
    const handleUpdateProfile = async () => {
        setError('');
        setSuccess('');
        try {
            await updateUserProfile({ email, password, newPassword });
            setSuccess('Profile updated successfully!');
        } catch (error) {
            setError('Error updating profile. Please try again.');
        }
    };

    return (
        <div>
            <h2>Profile</h2>

            {/* Display User Profile Update Form */}
            <div>
                <h3>Update Email</h3>
                <input
                    type="email"
                    placeholder="Enter new email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div>
                <h3>Change Password</h3>
                <input
                    type="password"
                    placeholder="Current password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>

            <button onClick={handleUpdateProfile}>Update Profile</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            {/* Display Saved Recipes */}
            <h3>My Saved Recipes</h3>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                {recipes.length === 0 && !loading && <p>No saved recipes yet.</p>}
                {recipes.map((recipe, index) => (
                    <div key={index}>
                        <h3>{recipe.title}</h3>
                        <img src={recipe.image_url} alt={recipe.title} />
                        <button>View Recipe</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Profile;
