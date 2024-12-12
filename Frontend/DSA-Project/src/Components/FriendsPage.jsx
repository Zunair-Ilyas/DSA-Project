import React from 'react';
import Sidebar from "./Sidebar.jsx";
import Friends from "./Friends.jsx";
import Suggestions from "./Suggestions.jsx";
import Navbar from './Navbar.jsx'

function FriendsPage(props) {
    return (
        <>
            <Navbar/>
            <div className="container">
                <Sidebar/>
                <Friends/>
                <Suggestions/>
            </div>
        </>
    );
}

export default FriendsPage;