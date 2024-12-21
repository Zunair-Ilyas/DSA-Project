import React, { useEffect, useState } from 'react';
import { Camera, Users, Image, X } from 'lucide-react';
import './ProfilePage.css';
import image from '../assets/ProfilePic1.png';
import Post from "./Post.jsx";
import axios from "axios";
import { useUser } from "./Login.jsx";

function EditProfileModal({ isOpen, onClose, user, onUpdateProfile }) {
    const [formData, setFormData] = useState({
        fullName: user.fullName || '',
        bio: user.bio || '',
        location: user.location || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || 'Prefer not to say'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const response = await axios.put(`http://localhost:2011/friends/updateUser/${userId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            onUpdateProfile(response.data.user);
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button
                    onClick={onClose}
                    className="modal-close-btn"
                >
                    <X size={24} />
                </button>
                <h2 className="modal-title">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            maxLength="160"
                        />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="Prefer not to say">Prefer not to say</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="modal-submit-btn"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

function ProfilePage() {
    const [posts, setPosts] = useState([]);
    const [User, setUser] = useState({});
    const [postCount, setPostCount] = useState(0);
    const [friendsCount, setFriendsCount] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        const fetchPosts = async () => {
            if (user && user._id) {
                try {
                    const id = localStorage.getItem('userId');
                    const response = await axios.get(`http://localhost:2011/post?userID=${id}`);
                    setPosts(response.data);
                } catch (error) {
                    console.error('Error fetching posts:', error);
                }
            }
        };

        const fetchUser = async () => {
            const id = localStorage.getItem('userId');
            try {
                const profileUser = await axios.get(`http://localhost:2011/friends/getUser/${id}`);
                setPostCount(profileUser.data.posts.length);
                setFriendsCount(profileUser.data.friends.length);
                setUser(profileUser.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchPosts();
        fetchUser();
    }, [user]);

    const handleUpdateProfile = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <div className="profile-container">
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={User}
                onUpdateProfile={handleUpdateProfile}
            />

            <div className="profile-header">
                <div className="profile-background"></div>

                <div className="profile-picture-container">
                    <div className="relative">
                        <div className="profile-picture">
                            <img
                                src={image}
                                alt={`${User.fullName}'s profile`}
                            />
                        </div>

                        <div className="edit-icon">
                            <Camera className="text-gray-600" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="user-info">
                <h2 className="user-name">{User.fullName}</h2>
                <p className="user-bio">{User.bio}</p>

                <div className="user-stats">
                    <div className="stat-item">
                        <div className="stat-number">{postCount}</div>
                        <div className="stat-label">
                            <Image size={16} /> Posts
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{friendsCount}</div>
                        <div className="stat-label">
                            <Users size={16} /> Friends
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    <button
                        className="btn-primary"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
            <div className="PostContainer">
                <div>
                    {posts.map((post) => (
                        <Post
                            key={post._id}
                            content={post.content}
                            createdAt={post.createdAt}
                            user={post.user}
                            media={post.media}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;