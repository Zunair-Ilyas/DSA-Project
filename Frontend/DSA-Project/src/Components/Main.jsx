import React, {useEffect, useState} from 'react';
import writePostIcon from "../assets/WritePostIcon.svg";
import uploadPhotoIcon from "../assets/UploadPhotoIcon.svg";
import uploadVideoIcon from "../assets/UploadVideoIcon.svg";
import writePostPlaceholderIcon from "../assets/WritePostPlaceholderIcon.svg";
import profilePicture from '../assets/ProfilePic1.png'
import event from '../assets/event.jpg'
import './Main.css'
import video from '../assets/GPA calculator.mp4'
import Post from "./Post.jsx";
import axios from "axios";

function Main(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios('http://localhost:2007/post?userID=6730f2bc06a924910ff28ea5');
                setPosts(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <>
            <main className="main">
                <div className="mainCreatePost">
                    <div className="mainCreatePostOptions">
                        <ul>
                            <li>
                                <img src={writePostIcon} alt="writePostIcon"/>
                                <p>Write a post</p>
                            </li>
                            <li>
                                <img src={uploadPhotoIcon} alt="uploadPhotoIcon"/>
                                <p>Upload photo</p>
                            </li>
                            <li>
                                <img src={uploadVideoIcon} alt="uploadVideoIcon"/>
                                <p>Upload video</p>
                            </li>
                        </ul>
                    </div>
                    <div className="PostInput">
                        <div className="textarea-container">
                                <textarea
                                    rows="4"
                                    cols="80"
                                    className="PostText"
                                    placeholder=" "
                                ></textarea>
                            <div className="textarea-placeholder">
                                <img src={writePostPlaceholderIcon} alt="icon"/>
                                <span>Write something here...</span>
                            </div>
                        </div>
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
            </main>
        </>
    );
}

export default Main;