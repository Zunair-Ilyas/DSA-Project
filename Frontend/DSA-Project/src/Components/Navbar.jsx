import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './Login';
import logo from "../assets/Logo.svg";
import searchIcon from "../assets/searchIcon.svg";
import profilePic from "../assets/ProfilePic1.png";
import settingsIcon from "../assets/SettingsIcon.svg";
import notificationsIcon from "../assets/NotificationsIcon.svg";
import './Navbar.css';
import { useNavigate } from "react-router-dom";
import image from '../assets/ProfileIcon2.svg'

function Navbar(props) {
    const navigate = useNavigate();
    const { user } = useUser(); // Get user from context
    const [friendRequests, setFriendRequests] = useState([]);
    const [showRequestsModal, setShowRequestsModal] = useState(false);

    // Fetch friend requests when component mounts
    useEffect(() => {
        // Only fetch if user is logged in
        if (user) {
            const fetchFriendRequests = async () => {
                try {
                    // Fetch full user details to get received friend requests
                    const response = await axios.get(`http://localhost:2011/friends/getUser/${user._id}`);

                    // Fetch details for each sender of friend requests
                    const requestDetails = await Promise.all(
                        response.data.friendRequestsReceived.map(async (senderId) => {
                            const senderResponse = await axios.get(`http://localhost:2011/friends/getUser/${senderId}`);
                            return {
                                id: senderId,
                                ...senderResponse.data
                            };
                        })
                    );

                    setFriendRequests(requestDetails);
                } catch (error) {
                    console.error('Error fetching friend requests:', error);
                }
            };

            fetchFriendRequests();
        }
    }, [user]); // Add user as a dependency

    const handleProfileClick = () => {
        navigate('/home');
    };

    const handleProfileClick2 = () => {
        navigate('/profile');
    };

    const handleAcceptFriendRequest = async (senderId) => {
        try {
            await axios.post('http://localhost:2011/friends/accept-request', {
                senderID: senderId,
                receiverID: user._id // Use actual user ID from context
            });

            // Remove the accepted request from the list
            setFriendRequests(friendRequests.filter(req => req.id !== senderId));
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleDeclineFriendRequest = async (senderId) => {
        try {
            await axios.post('http://localhost:2011/friends/reject-request', {
                senderID: senderId,
                receiverID: user._id // Use actual user ID from context
            });

            // Remove the declined request from the list
            setFriendRequests(friendRequests.filter(req => req.id !== senderId));
        } catch (error) {
            console.error('Error declining friend request:', error);
        }
    };

    // If no user is logged in, you might want to redirect or show a login prompt
    if (!user) {
        return null; // or return a login prompt
    }

    return (
        <>
            <div className="topBar">
                <div className="logo">
                    <img src={logo} alt="logo" onClick={handleProfileClick} />
                </div>
                <div className="topBarLeft">
                    <div className="topBarSearchIcon">
                        <img src={searchIcon} alt="searchIcon" />
                    </div>
                    <input className="search-topBar" placeholder='search for friends...' />
                </div>
                <div className="topBarRight">
                    <ul>
                        <li className="topBarUserProfile">
                            <div className="topBarUserProfileImg">
                                <img src={profilePic} alt="profilePic" onClick={handleProfileClick2}/>
                            </div>
                            <div className="topBarUserProfileName">
                                <p onClick={handleProfileClick2}>{user.fullName}</p>
                                <p onClick={handleProfileClick2}>@{user.userName}</p>
                            </div>
                        </li>
                        <li className="topBarSettings">
                            <div>
                                <img src={settingsIcon} alt="settingsIcon" />
                            </div>
                        </li>
                        <li className="topBarNotifications" onClick={() => setShowRequestsModal(!showRequestsModal)}>
                            <div>
                                <img src={notificationsIcon} alt="notificationsIcon" />
                                {friendRequests.length > 0 && (
                                    <span className="notification-badge">{friendRequests.length}</span>
                                )}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Friend Requests Modal */}
            {showRequestsModal && (
                <div className="friend-requests-modal">
                    <h3>Friend Requests</h3>
                    {friendRequests.length === 0 ? (
                        <p>No new friend requests</p>
                    ) : (
                        friendRequests.map(request => (
                            <div key={request.id} className="friend-request-item">
                                <img
                                    src={image || 'default-profile.png'}
                                    alt={request.fullName}
                                />
                                <div className="friend-request-details">
                                    <p>{request.fullName}</p>
                                    <p className="username">@{request.userName}</p>
                                    <div className="friend-request-actions">
                                        <button
                                            onClick={() => handleAcceptFriendRequest(request.id)}
                                            className="accept-btn"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleDeclineFriendRequest(request.id)}
                                            className="decline-btn"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </>
    );
}

export default Navbar;