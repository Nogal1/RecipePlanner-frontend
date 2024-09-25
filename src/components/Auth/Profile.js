import React, { useState } from 'react';
import { updateUserProfile } from '../../services/api';  // API call to update user profile

// Profile component to allow users to update their email or password
function Profile() {
    // State variables to store email, password, newPassword, error and success messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Function to handle updating user profile (email or password)
    const handleUpdateProfile = async () => {
        setError('');  // Clear previous errors
        setSuccess('');  // Clear previous success messages
        try {
            // Send profile update request to the server
            await updateUserProfile({ email, password, newPassword });
            setSuccess('Profile updated successfully!');  // Success message
        } catch (error) {
            setError('Error updating profile. Please try again.');  // Error message on failure
        }
    };

    return (
        <div className="container mt-5">
            {/* Profile settings heading */}
            <h2 className="text-center mb-4">Profile Settings</h2>

            {/* User Profile Update Form */}
            <div className="card p-4">
                {/* Section to update the user's email */}
                <h3 className="mb-3">Update Email</h3>
                <div className="form-group">
                    <label htmlFor="email">New Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter new email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}  // Update email state on input change
                    />
                </div>

                {/* Section to change the user's password */}
                <h3 className="mt-4 mb-3">Change Password</h3>
                <div className="form-group">
                    <label htmlFor="current-password">Current Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="current-password"
                        placeholder="Current password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}  // Update password state on input change
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
                        onChange={(e) => setNewPassword(e.target.value)}  // Update newPassword state on input change
                    />
                </div>

                {/* Button to submit the profile update */}
                <button className="btn btn-primary mt-4" onClick={handleUpdateProfile}>
                    Update Profile
                </button>

                {/* Display error or success messages */}
                {error && <p className="text-danger mt-3">{error}</p>}
                {success && <p className="text-success mt-3">{success}</p>}
            </div>
        </div>
    );
}

export default Profile;
