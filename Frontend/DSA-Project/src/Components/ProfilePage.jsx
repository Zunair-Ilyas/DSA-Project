import React, {useEffect, useState} from 'react';
import { Camera, Users, Image } from 'lucide-react';
import './ProfilePage.css';
import image from '../assets/ProfilePic1.png'
import Post from "./Post.jsx";
import axios from "axios";

function ProfilePage () {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios('http://localhost:2011/post?userID=6730f2bc06a924910ff28ea5');
                setPosts(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);
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
                            <Camera className="text-gray-600" size={20}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="user-info">
                <h2 className="user-name">John Doe</h2>
                <p className="user-bio">Software Engineer | Tech Enthusiast | Traveler</p>

                <div className="user-stats">
                    <div className="stat-item">
                        <div className="stat-number">145</div>
                        <div className="stat-label">
                            <Image size={16}/> Posts
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">57</div>
                        <div className="stat-label">
                            <Users size={16}/> Friends
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