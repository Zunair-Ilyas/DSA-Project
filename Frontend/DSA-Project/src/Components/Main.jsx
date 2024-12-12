import React, { useEffect, useState, useRef } from 'react';
import writePostIcon from "../assets/WritePostIcon.svg";
import uploadPhotoIcon from "../assets/UploadPhotoIcon.svg";
import uploadVideoIcon from "../assets/UploadVideoIcon.svg";
import writePostPlaceholderIcon from "../assets/WritePostPlaceholderIcon.svg";
import './Main.css';
import axios from "axios";
import Post from "./Post.jsx";

function Main(props) {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');  // State to manage post content
    const [media, setMedia] = useState(null);  // State to manage uploaded media (photo/video)
    const textAreaRef = useRef(null);  // Reference to the text area
    const userID = "6730f2bc06a924910ff28ea5";  // Replace this with dynamic user ID (from context, props, or localStorage)

    // Fetch posts from the API
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios(`http://localhost:2011/post/getAllPosts/${userID}`);
                setPosts(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [userID]);  // Re-fetch posts whenever the userID changes

    // Handle the creation of a post
    const handleCreatePost = async () => {
        try {
            const formData = new FormData();
            formData.append('content', content);
            if (media) {
                formData.append('media', media);
            }

            // Assuming the API for creating posts is 'http://localhost:2011/post/create'
            const response = await axios.post('http://localhost:2011/post/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                params: { userID }, // Pass the userID dynamically to the backend
            });

            // After successfully creating a post, update the post list
            setPosts([response.data, ...posts]);
            setContent('');  // Clear content after posting
            setMedia(null);  // Clear media after posting
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    // Handle file upload for photo or video
    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);  // Set the uploaded file as media
        }
    };

    // Handle clicking "Write a post" and focusing on the textarea
    const handleWritePostClick = () => {
        textAreaRef.current.focus();  // Focus on the textarea
    };

    return (
        <>
            <main className="main">
                <div className="mainCreatePost">
                    <div className="mainCreatePostOptions">
                        <ul>
                            <li onClick={handleWritePostClick}>
                                <img src={writePostIcon} alt="writePostIcon" />
                                <p>Write a post</p>
                            </li>
                            <li>
                                <label>
                                    <img src={uploadPhotoIcon} alt="uploadPhotoIcon" />
                                    <p>Upload photo</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleMediaChange}
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    <img src={uploadVideoIcon} alt="uploadVideoIcon" />
                                    <p>Upload video</p>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        style={{ display: 'none' }}
                                        onChange={handleMediaChange}
                                    />
                                </label>
                            </li>
                        </ul>
                    </div>
                    <div className="PostInput">
                        <div className="textarea-container">
                            <textarea
                                ref={textAreaRef}  // Reference to the text area
                                rows="4"
                                cols="80"
                                className="PostText"
                                placeholder=" "
                                value={content}
                                onChange={(e) => setContent(e.target.value)}  // Update content as user types
                            ></textarea>
                            <div className="textarea-placeholder">
                                <img src={writePostPlaceholderIcon} alt="icon" />
                                <span>Write something here...</span>
                            </div>
                        </div>
                    </div>
                    <button className="postButton" onClick={handleCreatePost}>Post</button>
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
            </main>
        </>
    );
}

export default Main;
