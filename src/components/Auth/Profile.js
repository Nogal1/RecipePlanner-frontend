import React, { useState } from 'react';
import { updateUserProfile } from '../../services/api';  // Remove fetchSavedRecipes since we no longer use it

function Profile() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        <div className="container mt-5">
            <h2 className="text-center mb-4">Profile Settings</h2>

            {/* Display User Profile Update Form */}
            <div className="card p-4">
                <h3 className="mb-3">Update Email</h3>
                <div className="form-group">
                    <label htmlFor="email">New Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter new email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <h3 className="mt-4 mb-3">Change Password</h3>
                <div className="form-group">
                    <label htmlFor="current-password">Current Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="current-password"
                        placeholder="Current password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="new-password">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="new-password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <button className="btn btn-primary mt-4" onClick={handleUpdateProfile}>
                    Update Profile
                </button>

                {error && <p className="text-danger mt-3">{error}</p>}
                {success && <p className="text-success mt-3">{success}</p>}
            </div>
        </div>
    );
}

export default Profile;
