import React from 'react';
import profilePic from "../assets/ProfilePic1.png";
import profileIcon from "../assets/ProfileIcon.svg";
import friendsIcon from "../assets/FriendIcon.svg";
import settingsBoxIcon from "../assets/SettingBoxIcon.svg";
import logoutIcon from "../assets/LogoutIcon.svg";
import './Sidebar.css';
import { useNavigate } from "react-router-dom";
import {useUser} from "./Login.jsx";

function Sidebar(props) {
    const navigate = useNavigate();
    const { user } = useUser();

    // Handle navigation on profile click
    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleProfileClick2 = () => {
        navigate('/friends');
    };

    // Handle logout functionality
    const handleLogout = () => {
        // Clear all items from localStorage
        localStorage.clear();

        // Navigate to login page
        navigate('/login');
    };

    return (
        <>
            <aside className="sidebar">
                <div className="sidebarUserProfile">
                    <img src={profilePic} alt="profilePic" className="sidebarUserProfileImg" />
                    <p>{user?.fullName || "Full Name"}</p>
                </div>
                <div className="sidebarOptions">
                    <ul className="options">
                        <li onClick={handleProfileClick} className="profileLink">
                            <img src={profileIcon} alt='settingsIcon' />
                            <p>Profile</p>
                        </li>
                        <li onClick={handleProfileClick2}>
                            <img src={friendsIcon} alt='settingsIcon' />
                            <p>Friends</p>
                        </li>
                        <li>
                            <img src={settingsBoxIcon} alt='settingsIcon' />
                            <p>Settings</p>
                        </li>
                        <li onClick={handleLogout}>
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