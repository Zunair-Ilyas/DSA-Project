import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Friends.css';

function Friends({ userID }) {
    const [friends, setFriends] = useState([]);
    const [mutualFriends, setMutualFriends] = useState({});
    const [mutualFriendsDetails, setMutualFriendsDetails] = useState({});
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFriendsData = async () => {
            try {
                setIsLoading(true);

                // Fetch friends
                const friendsResponse = await axios.get(`http://localhost:2011/friends/getFriends/6731a0e2743c20843285dff8`);
                if (Array.isArray(friendsResponse.data)) {
                    setFriends(friendsResponse.data);

                    // Fetch mutual friends for each friend
                    const mutualFriendsMap = {};
                    const mutualFriendsDetailsMap = {};

                    for (const friend of friendsResponse.data) {
                        try {
                            const id = localStorage.getItem('userId')
                            const mutualResponse = await axios.get(
                                `http://localhost:2011/friends/mutual-friends/${id}/${friend._id}`
                            );

                            // Check if response has mutualFriends array
                            const mutualFriendIds = mutualResponse.data.mutualFriends || [];
                            mutualFriendsMap[friend._id] = mutualFriendIds;

                            // Fetch details for mutual friends
                            if (mutualFriendIds.length > 0) {
                                const mutualDetailsPromises = mutualFriendIds.map(async (mutualId) => {
                                    try {
                                        const detailResponse = await axios.get(`http://localhost:2011/users/get-user/${mutualId}`);
                                        return detailResponse.data;
                                    } catch (detailErr) {
                                        console.error(`Error fetching details for mutual friend ${mutualId}:`, detailErr);
                                        return null;
                                    }
                                });

                                const mutualDetails = await Promise.all(mutualDetailsPromises);
                                mutualFriendsDetailsMap[friend._id] = mutualDetails.filter(detail => detail !== null);
                            }
                        } catch (mutualErr) {
                            console.error(`Error fetching mutual friends for ${friend.userName}:`, mutualErr);
                            mutualFriendsMap[friend._id] = [];
                            mutualFriendsDetailsMap[friend._id] = [];
                        }
                    }

                    setMutualFriends(mutualFriendsMap);
                    setMutualFriendsDetails(mutualFriendsDetailsMap);
                } else {
                    console.error('Expected an array but received:', friendsResponse.data);
                }
            } catch (err) {
                setError('Failed to load friends');
                console.error('Friends fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFriendsData();
    }, [userID]);

    const handleRemoveFriend = async (friendId) => {
        try {

            const currentUserId = localStorage.getItem('userId');

            const response = await axios.post('http://localhost:2011/friends/unfriend', {
                senderID: currentUserId,
                receiverID: friendId
            });

            // Remove the friend from the local state
            setFriends(prevFriends =>
                prevFriends.filter(friend => friend._id !== friendId)
            );

            // Close the friend details modal
            setSelectedFriend(null);

            // Optional: Show a success toast/notification
            alert(response.data.message); // Replace with your preferred notification method
        } catch (err) {
            console.error('Failed to remove friend', err);

            // Handle different error scenarios
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                alert(err.response.data.message || 'Failed to remove friend');
            } else if (err.request) {
                // The request was made but no response was received
                alert('No response received from server');
            } else {
                // Something happened in setting up the request that triggered an Error
                alert('Error removing friend');
            }
        }
    };

    const openFriendDetails = (friend) => {
        setSelectedFriend(friend);
    };

    const closeFriendDetails = () => {
        setSelectedFriend(null);
    };

    const renderBio = (bio) => {
        if (!bio) return <p className="no-bio">No bio available</p>;

        // If bio is long, truncate it
        if (bio.length > 150) {
            return (
                <p className="friend-bio truncated">
                    {bio.slice(0, 150)}...
                </p>
            );
        }

        return <p className="friend-bio">{bio}</p>;
    };

    if (isLoading) {
        return (
            <div className="friends-loading">
                <div className="loading-spinner"></div>
                <p>Loading friends...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="friends-error">
                <p>{error}</p>
            </div>
        );
    }

    if (friends.length === 0) {
        return (
            <div className="no-friends">
                <p>You have no friends yet</p>
            </div>
        );
    }

    return (
        <div className="friends-container">
            <h2 className="friends-title">Your Friends ({friends.length})</h2>

            <div className="friends-grid">
                {friends.map((friend) => (
                    <div
                        key={friend._id}
                        className="friend-card"
                        onClick={() => openFriendDetails(friend)}
                    >
                        <div className="friend-header">
                            {friend.profilePic ? (
                                <img
                                    src={friend.profilePic}
                                    alt={friend.userName}
                                    className="friend-profile-pic"
                                />
                            ) : (
                                <div className="default-profile-icon">👤</div>
                            )}
                            <div className="friend-info">
                                <h3 className="friend-name">{friend.fullName || friend.userName}</h3>
                                <p className="friend-username">@{friend.userName}</p>
                            </div>
                        </div>

                        <div className="friend-details">
                            {renderBio(friend.bio)}
                        </div>
                    </div>
                ))}
            </div>

            {selectedFriend && (
                <div className="friend-details-modal">
                    <div className="friend-details-content">
                        <button
                            className="close-details-btn"
                            onClick={closeFriendDetails}
                        >
                            ×
                        </button>

                        <div className="friend-details-header">
                            {selectedFriend.profilePic ? (
                                <img
                                    src={selectedFriend.profilePic}
                                    alt={selectedFriend.userName}
                                    className="large-profile-pic"
                                />
                            ) : (
                                <div className="large-default-profile-icon">👤</div>
                            )}
                            <div className="friend-details-info">
                                <h2>{selectedFriend.fullName || selectedFriend.userName}</h2>
                                <p className="username">@{selectedFriend.userName}</p>
                            </div>
                        </div>

                        <div className="friend-details-bio">
                            <h3>Bio</h3>
                            {renderBio(selectedFriend.bio)}
                        </div>

                        <div className="mutual-friends-section">
                            <h3>Mutual Friends</h3>
                            {mutualFriendsDetails[selectedFriend._id] &&
                            mutualFriendsDetails[selectedFriend._id].length > 0 ? (
                                <div className="mutual-friends-grid">
                                    {mutualFriendsDetails[selectedFriend._id].map((mutualFriend) => (
                                        <div key={mutualFriend._id} className="mutual-friend-card">
                                            {mutualFriend.profilePic ? (
                                                <img
                                                    src={mutualFriend.profilePic}
                                                    alt={mutualFriend.userName}
                                                    className="mutual-friend-pic"
                                                />
                                            ) : (
                                                <div className="mutual-friend-default-icon">👤</div>
                                            )}
                                            <p>{mutualFriend.fullName || mutualFriend.userName}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No mutual friends</p>
                            )}
                        </div>

                        <button
                            className="remove-friend-btn"
                            onClick={() => handleRemoveFriend(selectedFriend._id)}
                        >
                            Remove Friend
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Friends;