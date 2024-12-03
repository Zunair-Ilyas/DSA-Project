import React from 'react';
import logo from "../assets/Logo.svg";
import searchIcon from "../assets/searchIcon.svg";
import profilePic from "../assets/ProfilePic1.png";
import settingsIcon from "../assets/SettingsIcon.svg";
import notificationsIcon from "../assets/NotificationsIcon.svg";
import './Navbar.css'

function Navbar(props) {
    return (
        <>
            <div className="topBar">
                <div className="logo">
                    <img src={logo} alt="profilePic"/>
                </div>
                <div className="topBarLeft">
                    <div className="topBarSearchIcon">
                        <img src={searchIcon} alt="profilePic"/>
                    </div>
                    <input className="search-topBar" placeholder='search for friends...'/>
                </div>
                <div className="topBarRight">
                    <ul>
                        <li className="topBarUserProfile">
                            <div className="topBarUserProfileImg">
                                <img src={profilePic} alt='image1'/>
                            </div>
                            <div className="topBarUserProfileName">
                                <p>Full Name</p>
                                <p>@UserName</p>
                            </div>
                        </li>
                        <li className="topBarSettings">
                            <div>
                                <img src={settingsIcon} alt='image2'/>
                            </div>
                        </li>
                        <li className="topBarNotifications">
                            <div>
                                <img src={notificationsIcon} alt='image3'/>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Navbar;