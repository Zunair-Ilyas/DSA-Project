import React from 'react';
import profilePic from "../assets/ProfilePic1.png";
import profileIcon from "../assets/ProfileIcon.svg";
import friendsIcon from "../assets/FriendIcon.svg";
import settingsBoxIcon from "../assets/SettingBoxIcon.svg";
import logoutIcon from "../assets/LogoutIcon.svg";
import './Sidebar.css';
import { useNavigate } from "react-router-dom";

function Sidebar(props) {
    const navigate = useNavigate();

    // Handle navigation on profile click
    const handleProfileClick = () => {
        navigate('/profile');  // Navigate to the profile page
    };

    return (
        <>
            <aside className="sidebar">
                <div className="sidebarUserProfile">
                    <img src={profilePic} alt="profilePic" className="sidebarUserProfileImg" />
                    <p>Full Name</p>
                </div>
                <div className="sidebarOptions">
                    <ul className="options">
                        <li onClick={handleProfileClick} className="profileLink">
                            <img src={profileIcon} alt='settingsIcon' />
                            <p>Profile</p>
                        </li>
                        <li>
                            <img src={friendsIcon} alt='settingsIcon' />
                            <p>Friends</p>
                        </li>
                        <li>
                            <img src={settingsBoxIcon} alt='settingsIcon' />
                            <p>Settings</p>
                        </li>
                        <li>
                            <img src={logoutIcon} alt='settingsIcon' />
                            <p>Log Out</p>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
