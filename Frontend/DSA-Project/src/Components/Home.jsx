import React from 'react';
import './Home.css';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import Suggestions from './Suggestions.jsx';
import Main from "./Main.jsx";

function Home(props) {
    return (
        <>
            <Navbar />
            <div className="container">
                <Sidebar />
                <Main/>
                <Suggestions />
            </div>
        </>
    );
}

export default Home;
