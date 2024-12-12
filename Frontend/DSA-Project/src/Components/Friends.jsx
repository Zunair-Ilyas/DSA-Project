import React, { useEffect, useState } from 'react';
import profilePic from "../assets/ProfilePic1.png"; // Sample profile picture
import axios from 'axios';
import './Friends.css'; // Make sure to style it accordingly

function Friends({ userID }) {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        // Fetch user's friends from the API
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`http://localhost:2011/friends/getFriends/${userID}`);
                setFriends(response.data);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [userID]);

    return (
        <div className="friendsPage">
            <h2>Your Friends</h2>
            <div className="friendsList">
                {friends.length === 0 ? (
                    <p>No friends found</p>
                ) : (
                    friends.map((friend) => (
                        <div className="friend" key={friend._id}>
                            <img src={profilePic} alt={friend.userName} className="friendProfilePic" />
                            <div className="friendDetails">
                                <p className="friendName">{friend.fullName || friend.userName}</p>
                                <p className="friendBio">Bio: {friend.bio || "No bio available"}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Friends;
