import React from 'react';
import './Post.css';

function Post({ content, createdAt, user, media = [] }) {
    const isMediaAvailable = media.length > 0;
    const mediaSrc = isMediaAvailable ? media[0] : null;
    const isVideo = mediaSrc?.endsWith('.mp4');
    const isImage = mediaSrc && !isVideo;

    return (
        <div className="Post">
            <div className="PostDetails">
                <img
                    src={`https://via.placeholder.com/48`}
                    alt="Profile"
                    className="PostProfilePicture"
                />
                <div className="PostUserInfo">
                    <p className="PostUserFullName">{user?.fullName || 'Anonymous'}</p>
                    <p className="PostUsername">@{user?.userName || 'unknown_user'}</p>
                    <p className="PostTimestamp">
                        {new Date(createdAt).toLocaleString()}
                    </p>
                </div>
            </div>
            <div className="PostContent">
                <p className="PostText">{content}</p>

                {isMediaAvailable && (
                    <div className="PostMedia">
                        {isVideo && (
                            <video controls className="PostVideo">
                                <source src={mediaSrc} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                        {isImage && (
                            <img src={mediaSrc} alt="Post Medias" className="PostImage" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Post;
