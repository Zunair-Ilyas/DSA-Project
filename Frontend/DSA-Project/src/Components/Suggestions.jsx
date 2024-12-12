import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Suggestions.css';
import image from '../assets/ProfileIcon2.svg'

function Suggestions({ userID }) {
    const [suggestions, setSuggestions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await axios.get(`http://localhost:2011/friends/friend-suggestions/6731a0e2743c20843285dff8`);
                console.log('Friend Suggestions API Response:', response.data);

                const userIDs = response.data.suggestions;

                if (!Array.isArray(userIDs)) {
                    throw new Error('Invalid suggestions format');
                }

                const userDetails = await Promise.all(
                    userIDs.map(async (id) => {
                        const userResponse = await axios.get(`http://localhost:2011/friends/getUser/${id}`);
                        const { id: userId, userName, fullName, profilePicture } = userResponse.data;
                        return {
                            id: userId,
                            userName,
                            fullName,
                            profilePicture
                        };
                    })
                );

                setSuggestions(userDetails);
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
            await axios.post('http://localhost:2011/friends/send-request', {
                senderID: id,
                receiverID: "6730c867e43e12504c597bcd"
            });

            setSuggestions(suggestions.filter(user => user.id !== selectedUser.id));

            setAlertMessage(`Friend request sent to ${selectedUser.fullName || selectedUser.userName}`);

            setTimeout(() => {
                setAlertMessage('');
            }, 3000);

            setIsModalOpen(false);
        } catch (error) {
            console.error('Error sending friend request:', error);
            setAlertMessage('Failed to send friend request');
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
                    key={user.id}
                    className="suggested"
                    onClick={() => handleUserClick(user)}
                >
                    <img
                        src={image || 'default-profile.png'}
                        alt={user.fullName || user.userName}
                    />
                    <div className="suggestedUserInfo">
                        <span>{user.fullName || user.userName}</span>
                        <span className="suggestedUserInfoBio">Suggested for you</span>
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