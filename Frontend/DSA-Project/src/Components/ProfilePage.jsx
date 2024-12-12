import React, { useEffect, useState } from 'react';
import { Camera, Users, Image } from 'lucide-react';
import './ProfilePage.css';
import image from '../assets/ProfilePic1.png';
import Post from "./Post.jsx";
import axios from "axios";
import { useUser } from "./Login.jsx";

function ProfilePage() {
    const [posts, setPosts] = useState([]);
    const [User, setUser] = useState({})
    const [postCount, setPostCount] = useState(0)
    const [friendsCount, setFriendsCount] = useState(0)
    const { user } = useUser();

    useEffect(() => {
        console.log(user); // Check if user is available

        const fetchPosts = async () => {
            if (user && user._id) {  // Ensure user and user._id are available
                try {
                    const id = localStorage.getItem('userId')
                    const response = await axios.get(`http://localhost:2011/post?userID=${id}`);
                    setPosts(response.data);
                    console.log(user._id);
                    console.log(response.data);
                } catch (error) {
                    console.error('Error fetching posts:', error);
                }
            } else {
                console.log('User is not available.');
            }
        };

        const fetchUser = async () => {
            const id = localStorage.getItem('userId');
            try {
                const profileUser = await axios.get(`http://localhost:2011/friends/getUser/${id}`);
                console.log(profileUser.data.posts.length);
                setPostCount(profileUser.data.posts.length)
                setFriendsCount(profileUser.data.friends.length)
                setUser(profileUser.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }

        fetchPosts();
        fetchUser()
    }, [user]);

    // const postsCount = User.data.posts.length
    // const friendsCount = User.data.friends.length

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-background"></div>

                <div className="profile-picture-container">
                    <div className="relative">
                        <div className="profile-picture">
                            <img
                                src={image}
                                alt={`John's profile`}
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
                    <button className="btn-primary">
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
};

export default ProfilePage;
