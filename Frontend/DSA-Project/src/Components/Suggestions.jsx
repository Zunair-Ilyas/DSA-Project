import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Suggestions.css';
import image from '../assets/ProfileIcon2.svg'

function Suggestions({ userID }) {
    const [suggestions, setSuggestions] = useState([]);
    const [mutualFriends, setMutualFriends] = useState({});
    const [mutualFriendsDetails, setMutualFriendsDetails] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const id = localStorage.getItem('userId')
                const response = await axios.get(`http://localhost:2011/friends/friend-suggestions/${id}`);

                const userIDs = response.data.suggestions;

                if (!Array.isArray(userIDs)) {
                    throw new Error('Invalid suggestions format');
                }

                // Fetch user details
                const userDetails = await Promise.all(
                    userIDs.map(async (suggestedId) => {
                        const userResponse = await axios.get(`http://localhost:2011/friends/getUser/${suggestedId}`);
                        const { _id: userId, userName, fullName, profilePicture } = userResponse.data;

                        // Fetch mutual friends for each suggested user
                        const mutualResponse = await axios.get(
                            `http://localhost:2011/friends/mutual-friends/${id}/${suggestedId}`
                        );

                        // Get mutual friend IDs
                        const mutualFriendIds = mutualResponse.data.mutualFriends || [];

                        // Fetch details for mutual friends
                        const mutualDetailsPromises = mutualFriendIds.map(async (mutualId) => {
                            try {
                                const detailResponse = await axios.get(`http://localhost:2011/friends/getUser/${mutualId}`);
                                return detailResponse.data;
                            } catch (detailErr) {
                                console.error(`Error fetching details for mutual friend ${mutualId}:`, detailErr);
                                return null;
                            }
                        });

                        const mutualDetails = await Promise.all(mutualDetailsPromises);

                        return {
                            _id: userId,
                            userName,
                            fullName,
                            profilePicture,
                            mutualFriends: mutualDetails.filter(detail => detail !== null)
                        };
                    })
                );

                setSuggestions(userDetails);

                // Organize mutual friends details
                const mutualFriendsMap = {};
                const mutualFriendsDetailsMap = {};

                userDetails.forEach(user => {
                    mutualFriendsMap[user._id] = user.mutualFriends.map(mf => mf._id);
                    mutualFriendsDetailsMap[user._id] = user.mutualFriends;
                });

                setMutualFriends(mutualFriendsMap);
                setMutualFriendsDetails(mutualFriendsDetailsMap);

            } catch (error) {
                console.error('Error fetching friend suggestions:', error);
            }
        };

        fetchSuggestions();
    }, [userID]);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleAddFriend = async () => {
        try {
            const id = localStorage.getItem('userId');
            const response = await axios.post('http://localhost:2011/friends/send-request', {
                senderID: id,
                receiverID: selectedUser._id
            });

            // Close modal instantly
            setIsModalOpen(false);
            setSelectedUser(null);

            // Set alert message from backend response
            setAlertMessage(response.data.message || `Friend request sent to ${selectedUser.fullName || selectedUser.userName}`);

            // Clear alert after 3 seconds
            setTimeout(() => {
                setAlertMessage('');

                // Remove the user from suggestions
                setSuggestions(suggestions.filter(user => user._id !== selectedUser._id));
            }, 3000);

        } catch (error) {
            console.error('Error sending friend request:', error);

            // Close modal instantly
            setIsModalOpen(false);
            setSelectedUser(null);

            // Use error response message if available
            const errorMessage = error.response?.data?.message || 'Failed to send friend request';

            setAlertMessage(errorMessage);

            setTimeout(() => {
                setAlertMessage('');
            }, 3000);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="suggestions">
            {alertMessage && (
                <div className="alert">
                    {alertMessage}
                </div>
            )}

            <h2 className="suggestionsHeading">People you may know</h2>
            {suggestions.map((user) => (
                <div
                    key={user._id}
                    className="suggested"
                    onClick={() => handleUserClick(user)}
                >
                    <img
                        src={image || 'default-profile.png'}
                        alt={user.fullName || user.userName}
                    />
                    <div className="suggestedUserInfo">
                        <span>{user.fullName || user.userName}</span>
                        <span className="suggestedUserInfoBio">
                            {mutualFriendsDetails[user._id] && mutualFriendsDetails[user._id].length > 0
                                ? `${mutualFriendsDetails[user._id].length} mutual friend${mutualFriendsDetails[user._id].length > 1 ? 's' : ''}`
                                : 'Suggested for you'}
                        </span>
                    </div>
                </div>
            ))}

            {isModalOpen && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <img
                                src={image || 'default-profile.png'}
                                alt={selectedUser.fullName || selectedUser.userName}
                            />
                            <div className="modal-user-info">
                                <span>{selectedUser.fullName || selectedUser.userName}</span>
                                <span>@{selectedUser.userName}</span>
                            </div>
                        </div>

                        <div className="mutual-friends-section">
                            <h3>Mutual Friends</h3>
                            {mutualFriendsDetails[selectedUser._id] &&
                            mutualFriendsDetails[selectedUser._id].length > 0 ? (
                                <div className="mutual-friends-grid">
                                    {mutualFriendsDetails[selectedUser._id].map((mutualFriend) => (
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

                        <div className="modal-actions">
                            <button
                                onClick={handleAddFriend}
                                className="add-friend-btn"
                            >
                                Add Friend
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="close-btn"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Suggestions;