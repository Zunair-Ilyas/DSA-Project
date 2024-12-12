import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};
        if (!formData.userName) errors.userName = 'Username is required';
        if (!formData.fullName) errors.fullName = 'Full Name is required';
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.password) errors.password = 'Password is required';
        if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';

        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            navigate('/register-step-two', { state: { formData } });
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-card">
                <img src={logo} className="registration-logo" alt="Logo"/>
                <h1 className="registration-heading">Create Your Account</h1>
                <form className="registration-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="userName">Username</label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                placeholder="Choose a unique username"
                                required
                            />
                            {errors.userName && <p className="error-message">{errors.userName}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                            {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email address"
                                required
                            />
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                required
                            />
                            {errors.password && <p className="error-message">{errors.password}</p>}
                        </div>
                    </div>

                    <button type="submit" className="submit-button">
                        Continue
                    </button>
                </form>

                <div className="login-redirect">
                    Already have an account? <Link to="/login" className="login-link">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default RegistrationStepOne;