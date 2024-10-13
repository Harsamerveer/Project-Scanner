import React, { useState } from 'react';
import axios from 'axios';

const ProfileScanner = () => {
    const [role, setRole] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState('');

    const handleScan = async () => {
        try {
            // Update the URL to use the Netlify function
            const response = await axios.get(`/.netlify/functions/scrapeProfiles?role=${encodeURIComponent(role)}`);
            setProfiles(response.data);
            setError('');
        } catch (err) {
            setError('Failed to find profiles. Please check the role.');
            setProfiles([]);
        }
    };

    return (
        <div>
            <h2>Profile Scanner</h2>
            <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter the role (e.g., Software Developer)"
            />
            <button onClick={handleScan}>Scan Profiles</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {profiles.length > 0 && (
                <div>
                    <h3>Profiles Found</h3>
                    {profiles.map((profile, index) => (
                        <div key={index}>
                            <p><strong>Name:</strong> {profile.name}</p>
                            <p><strong>Title:</strong> {profile.title}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfileScanner;
