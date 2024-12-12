import React from 'react';
import Sidebar from "./Sidebar.jsx";
import Suggestions from "./Suggestions.jsx";
import Navbar from "./Navbar.jsx";
import Main from "./Main.jsx";
import ProfilePage from "./ProfilePage.jsx";

function Profile(props) {
    return (
        <>
            <Navbar />
            <div className="container">
                <Sidebar />
                <ProfilePage/>
                <Suggestions />
            </div>
        </>
    );
}

export default Profile;