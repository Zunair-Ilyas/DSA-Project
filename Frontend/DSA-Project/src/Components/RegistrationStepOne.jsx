import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationStepOne.css'
import logo from '../assets/Logo.svg'

const RegistrationStepOne = () => {
    const [formData, setFormData] = useState({
        userName: '',
        fullName: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation for the form
        const errors = {};
        if (!formData.userName) errors.userName = 'Username is required';
        if (!formData.fullName) errors.fullName = 'Full Name is required';
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.password) errors.password = 'Password is required';
        if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';

        setErrors(errors);

        // If no validation errors, navigate to the second page
        if (Object.keys(errors).length === 0) {
            // Passing formData to the next step using state
            navigate('/register-step-two', { state: { formData } });
        }
    };

    return (
        <>
            <h1 className="Heading">Registration - Step 1</h1>
            <div className="RegistrationPage">
                <img src={logo} className="RegistrationPageLogo"/>
                <form className="RegistrationForm" onSubmit={handleSubmit}>
                    <div className="FormFieldRowOne">
                        <div className="FormField">
                            <label htmlFor="userName">Username</label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                            />
                            {errors.userName && <p className="Error">{errors.userName}</p>}
                        </div>

                        <div className="FormField">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                            {errors.fullName && <p className="Error">{errors.fullName}</p>}
                        </div>
                    </div>

                    <div className="FormFieldRowTwo">
                        <div className="FormField">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && <p className="Error">{errors.email}</p>}
                        </div>

                        <div className="FormField">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            {errors.password && <p className="Error">{errors.password}</p>}
                        </div>
                    </div>

                    <button type="submit" className="SubmitButton">
                        Next
                    </button>
                </form>
            </div>
        </>
    );
};

export default RegistrationStepOne;
