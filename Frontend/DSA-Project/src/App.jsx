import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationStepOne from './Components/RegistrationStepOne.jsx';
import RegistrationStepTwo from './Components/RegistrationStepTwo.jsx';
import Home from "./Components/Home.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register-step-one" element={<RegistrationStepOne />} />
                <Route path="/register-step-two" element={<RegistrationStepTwo />} />
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<RegistrationStepOne />} />
            </Routes>
        </Router>
    );
}

export default App;
