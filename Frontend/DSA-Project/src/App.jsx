import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationStepOne from './Components/RegistrationStepOne.jsx';
import RegistrationStepTwo from './Components/RegistrationStepTwo.jsx';
import Home from "./Components/Home.jsx";
import Profile from "./Components/Profile.jsx";
import Friends from "./Components/Friends.jsx";
import FriendsPage from "./Components/FriendsPage.jsx";
import Login from "./Components/Login.jsx";
import { UserProvider } from './Components/Login.jsx';

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/register-step-one" element={<RegistrationStepOne />} />
                    <Route path="/register-step-two" element={<RegistrationStepTwo />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<RegistrationStepOne />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/friends" element={<FriendsPage />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
