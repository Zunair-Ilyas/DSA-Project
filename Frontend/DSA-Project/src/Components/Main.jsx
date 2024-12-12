import React, { useEffect, useState, useRef } from 'react';
import writePostIcon from "../assets/WritePostIcon.svg";
import uploadPhotoIcon from "../assets/UploadPhotoIcon.svg";
import uploadVideoIcon from "../assets/UploadVideoIcon.svg";
import writePostPlaceholderIcon from "../assets/WritePostPlaceholderIcon.svg";
import './Main.css';
import axios from "axios";
import Post from "./Post.jsx";

function Main(props) {
    const id = localStorage.getItem('userId')
    const [data, setData] = useState({
        content: "",
        media: [],
        isPublic: true,
        userID: id
    });
    const [posts, setPosts] = useState([]); // State for fetched posts
    const textAreaRef = useRef(null);

    // Define fetchPosts as a reusable function
    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:2011/post/getAllPosts/${data.userID}`);
            setPosts(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Fetch posts on initial render
    useEffect(() => {
        fetchPosts();
    }, [data.userID]);

    const handleCreatePost = async () => {
        try {
            const response = await axios.post('http://localhost:2011/post', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Post created:', response.data);
            setData((prevState) => ({
                ...prevState,
                content: "",
                media: [],
            }));
            fetchPosts(); // Refresh posts after creating a new one
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleMediaChange = async (e) => {
        const files = Array.from(e.target.files);
        const base64Files = await Promise.all(
            files.map((file) => fileToBase64(file))
        );

        setData((prevState) => ({
            ...prevState,
            media: [...prevState.media, ...base64Files],
        }));
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleWritePostClick = () => {
        textAreaRef.current.focus();
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
                                        multiple
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
                                        multiple
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
                                ref={textAreaRef}
                                rows="4"
                                cols="80"
                                className="PostText"
                                placeholder=" "
                                value={data.content}
                                onChange={(e) =>
                                    setData((prevState) => ({
                                        ...prevState,
                                        content: e.target.value,
                                    }))
                                }
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
