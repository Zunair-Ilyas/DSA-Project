import React from 'react';
import logo from "../assets/Logo.svg";
import searchIcon from "../assets/searchIcon.svg";
import profilePic from "../assets/ProfilePic1.png";
import settingsIcon from "../assets/SettingsIcon.svg";
import notificationsIcon from "../assets/NotificationsIcon.svg";
import './Navbar.css';
import { useNavigate } from "react-router-dom";  // Import useNavigate

function Navbar(props) {
    const navigate = useNavigate();  // Initialize navigate

    const handleProfileClick = () => {
        navigate('/home');  // Navigate to /home when logo is clicked
    };
    const handleProfileClick2 = () => {
        navigate('/profile');  // Navigate to /home when logo is clicked
    };

    return (
        <>
            <div className="topBar">
                <div className="logo">
                    <img src={logo} alt="logo" onClick={handleProfileClick} />  {/* Update alt text */}
                </div>
                <div className="topBarLeft">
                    <div className="topBarSearchIcon">
                        <img src={searchIcon} alt="searchIcon" />
                    </div>
                    <input className="search-topBar" placeholder='search for friends...' />
                </div>
                <div className="topBarRight">
                    <ul>
                        <li className="topBarUserProfile">
                            <div className="topBarUserProfileImg">
                                <img src={profilePic} alt="profilePic" onClick={handleProfileClick2}/>
                            </div>
                            <div className="topBarUserProfileName">
                                <p onClick={handleProfileClick2}>Full Name</p>
                                <p onClick={handleProfileClick2}>@UserName</p>
                            </div>
                        </li>
                        <li className="topBarSettings">
                            <div>
                                <img src={settingsIcon} alt="settingsIcon" />
                            </div>
                        </li>
                        <li className="topBarNotifications">
                            <div>
                                <img src={notificationsIcon} alt="notificationsIcon" />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Navbar;
