import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useUser} from './Login';
import './UserPreviewModal.css'
import profilePic from "../assets/ProfilePic1.png";
import settingsIcon from "../assets/SettingsIcon.svg";
import notificationsIcon from "../assets/NotificationsIcon.svg";

const UserPreviewModal = ({targetUser, onClose}) => {
    const {user: currentUser} = useUser();
    const [userDetails, setUserDetails] = useState(null);
    const [mutualFriends, setMutualFriends] = useState([]);
    const [friendshipStatus, setFriendshipStatus] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                // Fetch detailed user information
                const userResponse = await axios.get(`http://localhost:2011/friends/getUser/${targetUser._id}`);

                // Fetch mutual friends
                const mutualResponse = await axios.get(`http://localhost:2011/friends/mutualFriends/${currentUser._id}/${targetUser._id}`);

                // Check friendship status
                const statusResponse = await axios.get(`http://localhost:2011/friends/checkFriendStatus/${currentUser._id}/${targetUser._id}`);

                setUserDetails(userResponse.data);
                setMutualFriends(mutualResponse.data);
                setFriendshipStatus(statusResponse.data.status);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [targetUser, currentUser]);

    const handleFriendAction = async () => {
        try {
            if (friendshipStatus === 'not_friends') {
                // Send friend request
                await axios.post('http://localhost:2011/friends/send-request', {
                    senderID: currentUser._id,
                    receiverID: targetUser._id
                });
                setFriendshipStatus('request_sent');
            } else if (friendshipStatus === 'friends') {
                // Remove friend
                await axios.post('http://localhost:2011/friends/remove-friend', {
                    userID: currentUser._id,
                    friendID: targetUser._id
                });
                setFriendshipStatus('not_friends');
            }
        } catch (error) {
            console.error('Error performing friend action:', error);
        }
    };

    if (!userDetails) return <div>Loading...</div>;

    return (
        <div className="user-preview-modal">
            <div className="user-preview-content">
                <button className="close-modal" onClick={onClose}>×</button>

                <div className="user-preview-header">
                    <img
                        src={userDetails.profilePicture || 'default-profile.png'}
                        alt={userDetails.fullName}
                        className="user-preview-avatar"
                    />
                    <div className="user-preview-info">
                        <h2>{userDetails.fullName}</h2>
                        <p>@{userDetails.userName}</p>
                    </div>
                </div>

                <div className="user-preview-bio">
                    <h3>Bio</h3>
                    <p>{userDetails.bio || 'No bio available'}</p>
                </div>

                <div className="user-preview-stats">
                    <div className="stat">
                        <strong>{userDetails.friends?.length || 0}</strong>
                        <span>Friends</span>
                    </div>
                    <div className="stat">
                        <strong>{userDetails.posts?.length || 0}</strong>
                        <span>Posts</span>
                    </div>
                </div>

                <div className="mutual-friends">
                    <h3>Mutual Friends ({mutualFriends.length})</h3>
                    <div className="mutual-friends-grid">
                        {mutualFriends.slice(0, 6).map(friend => (
                            <div key={friend._id} className="mutual-friend">
                                <img
                                    src={friend.profilePicture || 'default-profile.png'}
                                    alt={friend.fullName}
                                />
                                <p>{friend.fullName}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="user-preview-actions">
                    <button
                        className={`friend-action-btn ${
                            friendshipStatus === 'friends' ? 'remove-friend' : 'add-friend'
                        }`}
                        onClick={handleFriendAction}
                    >
                        {friendshipStatus === 'not_friends' && 'Add Friend'}
                        {friendshipStatus === 'request_sent' && 'Request Sent'}
                        {friendshipStatus === 'friends' && 'Remove Friend'}
                    </button>
                    <button
                        className="message-btn"
                        onClick={() => {/* Implement message functionality */
                        }}
                    >
                        Message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserPreviewModal;


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
                <img src={settingsIcon} alt="settingsIcon"/>
            </div>
        </li>
        <li className="topBarNotifications" onClick={() => setShowRequestsModal(!showRequestsModal)}>
            <div>
                <img src={notificationsIcon} alt="notificationsIcon"/>
                {friendRequests.length > 0 && (
                    <span className="notification-badge">{friendRequests.length}</span>
                )}
            </div>
        </li>
    </ul>
</div>