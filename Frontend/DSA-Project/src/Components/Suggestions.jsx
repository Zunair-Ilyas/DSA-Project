import React from 'react';
import profilePic from "../assets/ProfilePic1.png";
import profileIcon2 from "../assets/ProfileIcon2.svg";
import profileIcon3 from "../assets/ProfileIcon3.svg";
import './Suggestions.css'

function Suggestions(props) {
    return (
        <>
            <aside className="suggestions">
                <h5 className="suggestionsHeading">People you may know</h5>
                <div className="suggested">
                    <img src={profilePic} alt="profilePic" className="profilePic"/>
                    <div className="suggestedUserInfo">
                        <p className="suggestedUserInfoName">Name</p>
                        <p className="suggestedUserInfoBio">Hey I am a computer Science student</p>
                    </div>
                </div>
                <div className="suggested">
                    <img src={profileIcon2} alt="profilePic" className="profilePic"/>
                    <div className="suggestedUserInfo">
                        <p className="suggestedUserInfoName">Name</p>
                        <p className="suggestedUserInfoBio">Hey I am a computer Science student</p>
                    </div>
                </div>
                <div className="suggested">
                    <img src={profileIcon3} alt="profilePic" className="profilePic"/>
                    <div className="suggestedUserInfo">
                        <p className="suggestedUserInfoName">Name</p>
                        <p className="suggestedUserInfoBio">Hey I am a computer Science student</p>
                    </div>
                </div>
                <div className="suggested">
                    <img src={profilePic} alt="profilePic" className="profilePic"/>
                    <div className="suggestedUserInfo">
                        <p className="suggestedUserInfoName">Name</p>
                        <p className="suggestedUserInfoBio">Hey I am a computer Science student</p>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Suggestions;