import React, { useEffect, useState } from 'react';
import profilePic from "../assets/ProfilePic1.png";
import './Suggestions.css';
import axios from 'axios';

function Suggestions({ userID }) {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await axios.get(`http://localhost:2011/friends/friend-suggestions/6731a0e2743c20843285dff8`);
                console.log('Friend Suggestions API Response:', response.data);

                // Correctly access the array of user IDs from the response
                const userIDs = response.data.suggestions;

                if (!Array.isArray(userIDs)) {
                    throw new Error('Invalid suggestions format');
                }

                // Fetch user details for each suggested ID
                const userDetails = await Promise.all(
                    userIDs.map(async (id) => {
                        const userResponse = await axios.get(`http://localhost:2011/friends/getUser/${id}`);
                        const { _id, userName, fullName } = userResponse.data; // Extract relevant data
                        return { id: _id, userName, fullName }; // Map to a clean structure
                    })
                );

                setSuggestions(userDetails);
            } catch (error) {
                console.error('Error fetching friend suggestions:', error);
            }
        };

        fetchSuggestions();
    }, [userID]);

    return (
        <>
            <aside className="suggestions">
                <h5 className="suggestionsHeading">People you may know</h5>
                {suggestions.map((user) => (
                    <div className="suggested" key={user.id}>
                        <img src={profilePic} alt="profilePic" className="profilePic" />
                        <div className="suggestedUserInfo">
                            <p className="suggestedUserInfoName">{user.fullName || user.userName}</p>
                            <p className="suggestedUserInfoBio">{`Connect with ${user.fullName || user.userName}`}</p>
                        </div>
                    </div>
                ))}
            </aside>
        </>
    );
}

export default Suggestions;
